"use client";

import { useEffect, useState } from "react";
import { sketches } from "../data/sketches";
import { KeyEntryStep } from "./KeyEntryStep";
import { StoryReader, type ReaderChapter } from "./StoryReader";

type Note = {
  id: string;
  format: "digital" | "physical";
  category: string;
  cardIds: string[];
  sender: string;
  recipient: string;
  storySource: "self" | "magic_writer" | "legacy_arc";
  storyArcId: string | null;
  chapters: ReaderChapter[];
};

type Status = "idle" | "loading" | "approved" | "pending" | "expired";

function findSketch(id: string) {
  return sketches.find((s) => s.id === id);
}

export function ReadPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [note, setNote] = useState<Note | null>(null);
  const [pendingInfo, setPendingInfo] = useState<{
    sender: string;
    recipient: string;
  } | null>(null);
  const [unlockKey, setUnlockKey] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "approved" || !note) return;
    // Server fires book_opened on the first valid unlock; nothing to do here.
  }, [status, note]);

  const submit = async (k: string) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/notes/by-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ k }),
      });
      if (!res.ok) {
        setError(`Server error (${res.status})`);
        setStatus("idle");
        return;
      }
      const data = (await res.json()) as
        | { status: "approved"; note: Note }
        | { status: "pending"; sender: string; recipient: string }
        | { status: "not_found" };

      if (data.status === "approved") {
        setNote(data.note);
        setUnlockKey(k);
        setStatus("approved");
      } else if (data.status === "pending") {
        setPendingInfo({ sender: data.sender, recipient: data.recipient });
        setStatus("pending");
      } else {
        setStatus("expired");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
      setStatus("idle");
    }
  };

  if (status === "approved" && note) {
    const pairs = note.cardIds.map((cid, i) => ({
      sketch: findSketch(cid),
      chapter: note.chapters[i],
    }));
    return (
      <main className="relative z-20 min-h-screen">
        <StoryReader
          title={note.chapters[0]?.title ?? "A little something"}
          sender={note.sender}
          recipient={note.recipient}
          secretKey={unlockKey}
          pairs={pairs}
          bookId={note.id}
        />
      </main>
    );
  }

  if (status === "pending") {
    return (
      <main className="relative z-20 pt-28 pb-32 min-h-screen">
        <div className="max-w-xl mx-auto px-5 text-center">
          <h1 className="font-display text-5xl mb-3">Almost there.</h1>
          <p className="font-hand text-lg text-ink/75 mb-3">
            {pendingInfo?.sender || "Someone"} sent you a note — but it's still
            waiting for an admin to confirm payment.
          </p>
          <p className="font-hand text-base text-ink/65">
            Try again in a little while. We'll let {pendingInfo?.sender || "them"}{" "}
            know the moment it's live.
          </p>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setPendingInfo(null);
            }}
            className="mt-8 font-ui border border-ink/25 px-5 py-2 rounded-full hover:bg-ink/5 pencil-cursor"
          >
            Try a different password
          </button>
        </div>
      </main>
    );
  }

  if (status === "expired") {
    return (
      <main className="relative z-20 pt-28 pb-32 min-h-screen">
        <div className="max-w-xl mx-auto px-5 text-center">
          <h1 className="font-display text-5xl mb-3">This note has expired</h1>
          <p className="font-hand text-lg text-ink/75 mb-3">
            Notes only live for 7 days, then they vanish — no accounts, no
            traces.
          </p>
          <p className="font-hand text-base text-ink/65">
            Double-check the password with the sender, or ask them to send you
            a new note.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-8 font-ui border border-ink/25 px-5 py-2 rounded-full hover:bg-ink/5 pencil-cursor"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-20 pt-28 pb-32 min-h-screen">
      <div className="max-w-2xl mx-auto px-5">
        <KeyEntryStep
          loading={status === "loading"}
          serverError={error}
          onUnlock={submit}
        />
      </div>
    </main>
  );
}
