"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Payload } from "../../lib/payload";
import { sketches } from "../../data/sketches";
import { RoughBox } from "../../components/RoughBox";
import { Doodle } from "../../components/Doodle";
import { ConfettiBurst } from "../../components/ConfettiBurst";
import { buildAdminWhatsAppLink } from "../../lib/whatsapp";
import { StoryReader } from "../../read/StoryReader";
import { ShareMenu } from "./ShareMenu";

type Chapter = { title: string; body: string };

type Props = {
  payload: Payload;
  secretKey: string;
  storySource: "self" | "magic_writer";
  arcId: string | null;
  chapters: Chapter[];
  cardIds: string[];
  /** Called when the server returns 409. Returns a fresh key the parent
   *  has already swapped into compose state; the reveal retries with it. */
  onRegenerateKey: () => string;
};

type CreateState =
  | { status: "idle" }
  | { status: "creating" }
  | { status: "ready"; url: string; noteId: string }
  | { status: "error"; message: string };

const MAX_KEY_RETRIES = 5;

const CREATING_PHRASES = [
  "Inking the pages…",
  "Folding the corners…",
  "Sealing the envelope…",
  "Almost done…",
];

const PHRASE_INTERVAL_MS = 700;

export function RevealStep({
  payload,
  secretKey,
  storySource,
  arcId,
  chapters,
  cardIds,
  onRegenerateKey,
}: Props) {
  const [confettiKey, setConfettiKey] = useState(0);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [create, setCreate] = useState<CreateState>({ status: "idle" });
  const [phraseIdx, setPhraseIdx] = useState(0);
  const reduce = useReducedMotion();

  // Cycle through playful phrases while the note is being saved.
  useEffect(() => {
    if (create.status !== "creating") return;
    setPhraseIdx(0);
    const id = setInterval(() => {
      setPhraseIdx((i) => (i + 1) % CREATING_PHRASES.length);
    }, PHRASE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [create.status]);

  const submitWithKey = async (
    keyToTry: string,
    attempt: number,
  ): Promise<void> => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        k: keyToTry,
        format: payload.format,
        category: payload.category,
        cardIds: payload.cardIds,
        sender: payload.sender,
        recipient: payload.recipient,
        storySource,
        storyArcId: arcId,
        chapters,
      }),
    });
    if (res.status === 409 && attempt < MAX_KEY_RETRIES) {
      // Collision — regenerate (parent persists the new key into state) and retry.
      const fresh = onRegenerateKey();
      return submitWithKey(fresh, attempt + 1);
    }
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string };
      setCreate({
        status: "error",
        message: err?.error ?? `Server error (${res.status})`,
      });
      return;
    }
    const json = (await res.json()) as { id: string };
    const url = `${window.location.origin}/r/${encodeURIComponent(keyToTry)}`;
    setCreate({ status: "ready", url, noteId: json.id });
    setConfettiKey((k) => k + 1);
  };

  const submit = async () => {
    setCreate({ status: "creating" });
    try {
      await submitWithKey(secretKey, 0);
    } catch (e) {
      setCreate({
        status: "error",
        message: e instanceof Error ? e.message : "Network error",
      });
    }
  };

  const copy = async (text: string, set: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      set(true);
      setTimeout(() => set(false), 1500);
    } catch {
      // ignore
    }
  };

  const whatsAppHref = useMemo(
    () =>
      create.status === "ready"
        ? buildAdminWhatsAppLink({
            noteId: create.noteId,
            sender: payload.sender,
            recipient: payload.recipient,
            key: secretKey,
          })
        : null,
    [create, payload.sender, payload.recipient, secretKey],
  );

  if (create.status === "ready") {
    return (
      <ReadyView
        url={create.url}
        secretKey={secretKey}
        sender={payload.sender}
        recipient={payload.recipient}
        chapters={chapters}
        cardIds={cardIds}
        whatsAppHref={whatsAppHref}
        copiedKey={copiedKey}
        copiedLink={copiedLink}
        confettiKey={confettiKey}
        onCopyKey={() => copy(secretKey, setCopiedKey)}
        onCopyLink={() => copy(create.url, setCopiedLink)}
      />
    );
  }

  return (
    <section className="text-center max-w-xl mx-auto">
      <div className="flex justify-center gap-3 mb-4">
        <Doodle kind="star" color="#F6C667" size={24} drift={3.5} />
        <Doodle kind="heart" color="#FF4D8D" size={24} drift={4} />
        <Doodle kind="spark" color="#4A90E2" size={24} drift={3} />
      </div>
      <h1 className="font-display text-5xl mb-3">Ready when you are.</h1>
      <p className="font-hand text-lg text-ink/70 mb-8">
        We'll wrap up your note book and hand you a private link to share with{" "}
        {payload.recipient || "the recipient"}.
      </p>

      {create.status === "error" && (
        <div className="mt-6 bg-paper border border-sketchPink/40 px-4 py-3 rounded-sm font-hand text-sketchPink">
          Couldn't save: {create.message}
        </div>
      )}

      <div className="flex justify-center mt-8">
        <button
          type="button"
          onClick={submit}
          disabled={create.status === "creating"}
          className="font-ui bg-ink text-paper px-7 py-3 rounded-full hover:bg-sketchPink pencil-cursor disabled:opacity-50"
        >
          {create.status === "creating" ? (
            <span aria-live="polite" className="relative inline-block min-w-[10ch]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={phraseIdx}
                  initial={reduce ? { opacity: 1 } : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 1 } : { opacity: 0, y: -4 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.2 }}
                  className="inline-block"
                >
                  {CREATING_PHRASES[phraseIdx]}
                </motion.span>
              </AnimatePresence>
            </span>
          ) : (
            "Create my note →"
          )}
        </button>
      </div>

      <p className="font-hand text-sm text-ink/55 mt-8">
        Your note is delivered instantly and automatically disappears after
        7 days. No accounts, no traces.
      </p>
    </section>
  );
}

function ReadyView({
  url,
  secretKey,
  sender,
  recipient,
  chapters,
  cardIds,
  whatsAppHref,
  copiedKey,
  copiedLink,
  confettiKey,
  onCopyKey,
  onCopyLink,
}: {
  url: string;
  secretKey: string;
  sender: string;
  recipient: string;
  chapters: Chapter[];
  cardIds: string[];
  whatsAppHref: string | null;
  copiedKey: boolean;
  copiedLink: boolean;
  confettiKey: number;
  onCopyKey: () => void;
  onCopyLink: () => void;
}) {
  const [previewing, setPreviewing] = useState(false);

  const pairs = useMemo(
    () =>
      cardIds.map((id, i) => ({
        sketch: sketches.find((s) => s.id === id),
        chapter: chapters[i],
      })),
    [cardIds, chapters],
  );

  if (previewing) {
    return (
      <section className="relative">
        <div className="text-center mb-4">
          <p className="font-hand text-base text-ink/70 inline-flex items-center gap-3">
            <span className="font-ui text-xs uppercase tracking-[0.2em] bg-ink/10 px-2 py-1 rounded">
              preview
            </span>
            This is exactly what {recipient || "the recipient"} will see.
          </p>
        </div>
        <StoryReader
          title={chapters[0]?.title ?? "A little something"}
          sender={sender}
          recipient={recipient}
          secretKey={secretKey}
          pairs={pairs}
          bookId={null}
        />
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={() => setPreviewing(false)}
            className="font-ui border border-ink/25 px-6 py-3 rounded-full hover:bg-ink/5 pencil-cursor"
          >
            ← Back to share
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="text-center max-w-xl mx-auto">
      <ConfettiBurst trigger={confettiKey} />
      <div className="flex justify-center gap-3 mb-4">
        <Doodle kind="star" color="#F6C667" size={24} drift={3.5} />
        <Doodle kind="heart" color="#FF4D8D" size={24} drift={4} />
        <Doodle kind="spark" color="#4A90E2" size={24} drift={3} />
      </div>
      <h1 className="font-display text-5xl mb-3">It's in!</h1>
      <p className="font-hand text-lg text-ink/75 mb-8">
        Your note has been created. It will be visible to {recipient || "the recipient"}{" "}
        once your payment is confirmed.
      </p>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="relative bg-paper p-8 mx-auto"
        style={{ rotate: -1 }}
      >
        <RoughBox seed={101} roughness={1.9} strokeWidth={1.8} />
        <div className="font-ui text-xs uppercase tracking-wider text-ink/55 mb-2">
          Key
        </div>
        <div className="font-display text-5xl text-ink tracking-wide select-all break-all">
          {secretKey}
        </div>
        <button
          type="button"
          onClick={onCopyKey}
          className="font-ui text-sm text-ink/60 hover:text-sketchPink mt-4 pencil-cursor"
        >
          {copiedKey ? "✓ copied" : "Copy key"}
        </button>
      </motion.div>

      <div className="mt-8">
        <div className="font-ui text-xs uppercase tracking-wider text-ink/55 mb-2">
          Send the recipient to
        </div>
        <div className="bg-paper border border-ink/15 px-4 py-3 rounded-sm font-ui text-base text-ink/85 break-all">
          {url}
        </div>
        <div className="flex gap-3 justify-center mt-4 flex-wrap">
          <ShareMenu
            url={url}
            sender={sender}
            recipient={recipient}
            onCopy={onCopyLink}
            copied={copiedLink}
          />
          <motion.button
            type="button"
            onClick={onCopyLink}
            animate={copiedLink ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`font-ui px-5 py-2 rounded-full pencil-cursor transition-colors duration-300 border ${
              copiedLink
                ? "border-sketchGreen text-sketchGreen"
                : "border-ink/30 hover:bg-ink/5"
            }`}
          >
            {copiedLink ? "✓ Copied" : "Copy link"}
          </motion.button>
          <button
            type="button"
            onClick={() => setPreviewing(true)}
            className="font-ui border border-ink/30 px-5 py-2 rounded-full hover:bg-ink/5 pencil-cursor"
          >
            Preview the book →
          </button>
        </div>
      </div>

      {whatsAppHref && (
        <div className="mt-10">
          <a
            href={whatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-ui bg-sketchGreen text-ink px-6 py-3 rounded-full pencil-cursor hover:brightness-95"
          >
            Want faster approval? Send your payment confirmation to admin on WhatsApp →
          </a>
          <p className="font-hand text-sm text-ink/55 mt-3">
            (Otherwise we'll review at our usual pace and pop it live for you.)
          </p>
        </div>
      )}

      <p className="font-hand text-sm text-ink/55 mt-10">
        Your note is delivered instantly and automatically disappears after
        7 days. No accounts, no traces.
      </p>
    </section>
  );
}
