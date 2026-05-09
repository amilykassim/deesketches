"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RoughBox } from "../../src/components/RoughBox";
import { Doodle } from "../../src/components/Doodle";

type Status = "pending" | "approved" | "rejected";

type Item = {
  id: string;
  status: Status;
  createdAt: number;
  recipient: string;
  openedAt: number | null;
  rejectionReason: string | null;
};

type Result =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "ok"; items: Item[] }
  | { state: "error"; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LookupPage() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<Result>({ state: "idle" });
  const reduce = useReducedMotion();

  const submit = async () => {
    if (!EMAIL_RE.test(email.trim())) {
      setResult({ state: "error", message: "Please enter a valid email." });
      return;
    }
    setResult({ state: "loading" });
    try {
      const res = await fetch("/api/notes/by-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.status === 429) {
        setResult({
          state: "error",
          message: "Too many lookups. Try again in a few minutes.",
        });
        return;
      }
      if (!res.ok) {
        setResult({ state: "error", message: `Server error (${res.status})` });
        return;
      }
      const data = (await res.json()) as { items: Item[] };
      setResult({ state: "ok", items: data.items });
    } catch (e) {
      setResult({
        state: "error",
        message: e instanceof Error ? e.message : "Network error",
      });
    }
  };

  return (
    <main className="relative z-20 pt-28 pb-32 min-h-screen">
      <div className="max-w-2xl mx-auto px-5">
        <motion.section
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.4 }}
          className="text-center"
        >
          <div className="flex justify-center gap-3 mb-5">
            <Doodle kind="star" color="#F6C667" size={26} drift={3.5} />
            <Doodle kind="heart" color="#FF4D8D" size={26} drift={4} />
            <Doodle kind="spark" color="#4A90E2" size={26} drift={3} />
          </div>
          <h1 className="font-display text-5xl mb-3">Track your notes</h1>
          <p className="font-hand text-lg text-ink/70 mb-10">
            Enter the email you used when creating the note. We'll show you
            where things stand.
          </p>
          <label className="block relative bg-paper p-5 max-w-xl mx-auto text-left">
            <RoughBox seed={222} strokeWidth={1.4} />
            <span className="block font-ui text-xs uppercase tracking-wider text-ink/55 mb-2">
              Your email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="you@example.com"
              maxLength={120}
              className="w-full bg-transparent font-hand text-2xl text-ink placeholder-ink/30 focus:outline-none"
              autoComplete="email"
              autoFocus
            />
          </label>
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={submit}
              disabled={result.state === "loading"}
              className="font-ui bg-ink text-paper px-7 py-3 rounded-full hover:bg-sketchPink pencil-cursor disabled:opacity-50"
            >
              {result.state === "loading" ? "Looking up…" : "Show my notes →"}
            </button>
          </div>
        </motion.section>

        <ResultView result={result} />
      </div>
    </main>
  );
}

function ResultView({ result }: { result: Result }) {
  if (result.state === "idle" || result.state === "loading") return null;

  if (result.state === "error") {
    return (
      <p className="font-hand text-sketchPink mt-10 text-center">{result.message}</p>
    );
  }

  if (result.items.length === 0) {
    return (
      <p className="font-hand text-ink/70 mt-12 text-center">
        No notes for this email — or they've already vanished after 7 days.
      </p>
    );
  }

  return (
    <ul className="mt-12 space-y-4">
      {result.items.map((item) => (
        <li
          key={item.id}
          className="relative bg-paper p-5"
          style={{ boxShadow: "4px 6px 0 #1a1a1a18" }}
        >
          <RoughBox seed={item.id.length * 17} strokeWidth={1.3} />
          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="font-ui text-xs uppercase tracking-wider text-ink/55">
                For {item.recipient}
              </div>
              <div className="font-hand text-base text-ink/80 mt-1">
                Created {new Date(item.createdAt).toLocaleString()}
              </div>
              {item.openedAt && (
                <div className="font-hand text-base text-sketchGreen mt-1">
                  Opened {new Date(item.openedAt).toLocaleString()}
                </div>
              )}
              {item.rejectionReason && (
                <div className="font-hand text-base text-sketchPink mt-1">
                  {item.rejectionReason}
                </div>
              )}
            </div>
            <StatusPill status={item.status} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function StatusPill({ status }: { status: Status }) {
  const styles = {
    pending: { bg: "#F6C66744", color: "#1a1a1a", label: "Awaiting approval" },
    approved: { bg: "#6FCF9744", color: "#1a1a1a", label: "Live" },
    rejected: { bg: "#FF4D8D33", color: "#1a1a1a", label: "Needs changes" },
  } as const;
  const s = styles[status];
  return (
    <span
      className="font-ui text-xs uppercase tracking-[0.2em] px-3 py-1 rounded-full"
      style={{ background: s.bg, color: s.color, border: "1px solid #1a1a1a25" }}
    >
      {s.label}
    </span>
  );
}
