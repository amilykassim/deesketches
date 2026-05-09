"use client";

import { useEffect, useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { isReaderKeyShape } from "../lib/key";
import { RoughBox } from "../components/RoughBox";
import { Doodle } from "../components/Doodle";

type Props = {
  loading?: boolean;
  serverError?: string | null;
  onUnlock: (typedKey: string) => void;
};

export function KeyEntryStep({
  loading = false,
  serverError = null,
  onUnlock,
}: Props) {
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const cardControls = useAnimationControls();

  // Entry animation. We drive it imperatively (rather than relying on
  // animate={...}) so the on-error shake can target only `x` without
  // interfering with the entry's opacity / y / scale.
  useEffect(() => {
    if (reduce) {
      void cardControls.start({ opacity: 1, y: 0, scale: 1, transition: { duration: 0 } });
      return;
    }
    void cardControls.start({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.05 },
    });
  }, [cardControls, reduce]);

  const triggerError = (msg: string) => {
    setError(msg);
    if (reduce) return;
    void cardControls.start({
      x: [0, -10, 10, -8, 8, -4, 4, 0],
      transition: { duration: 0.4, ease: "easeInOut" },
    });
  };

  const submit = () => {
    const k = typed.trim();
    if (!isReaderKeyShape(k)) {
      triggerError("Enter the key the sender shared with you.");
      return;
    }
    setError(null);
    onUnlock(k);
  };

  const visibleError = serverError ?? error;

  return (
    <section className="text-center pt-8">
      <motion.div
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4 }}
        className="flex justify-center gap-3 mb-6"
      >
        <Doodle kind="star" color="#F6C667" size={26} drift={3.5} />
        <Doodle kind="heart" color="#FF4D8D" size={26} drift={4} />
        <Doodle kind="spark" color="#4A90E2" size={26} drift={3} />
      </motion.div>
      <motion.h1
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, delay: 0.05 }}
        className="font-display text-5xl mb-3"
      >
        A little book is waiting.
      </motion.h1>
      <motion.p
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, delay: 0.1 }}
        className="font-hand text-lg text-ink/70 mb-10"
      >
        Type the key the sender gave you.
      </motion.p>
      <motion.div
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14, scale: 0.98 }}
        animate={cardControls}
        className="relative bg-paper p-8 max-w-lg mx-auto"
        style={{ rotate: -0.6 }}
      >
        <RoughBox seed={88} roughness={1.9} strokeWidth={1.8} />
        <input
          type="text"
          name="note-key"
          value={typed}
          onChange={(e) => {
            setTyped(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="your key"
          className="w-full bg-transparent text-center font-display text-3xl sm:text-4xl text-ink tracking-wide placeholder-ink/25 focus:outline-none"
          autoFocus
          maxLength={64}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-1p-ignore
          data-bwignore
          data-lpignore="true"
        />
      </motion.div>
      {visibleError && (
        <motion.p
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 0.25 }}
          className="font-hand text-sketchPink mt-6 max-w-lg mx-auto"
        >
          {visibleError}
        </motion.p>
      )}
      <div className="mt-8">
        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="font-ui bg-ink text-paper px-7 py-3 rounded-full hover:bg-sketchPink pencil-cursor disabled:opacity-50"
        >
          {loading ? "Opening…" : "Open the book →"}
        </button>
      </div>
    </section>
  );
}
