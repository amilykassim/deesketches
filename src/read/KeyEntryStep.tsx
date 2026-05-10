"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from "framer-motion";
import { isReaderKeyShape } from "../lib/key";
import { RoughBox } from "../components/RoughBox";
import { Doodle } from "../components/Doodle";
import { LockOpen } from "./LockOpen";

type Props = {
  loading?: boolean;
  serverError?: string | null;
  onUnlock: (typedKey: string) => void;
  /** When provided, the input magic-types this key character-by-character
   *  and auto-submits on completion. Caller is responsible for shape validation. */
  autoTypeKey?: string | null;
  /** Show the lock-opening flourish next to the input. Driven by parent's
   *  unlock state; component is purely visual and unmounts on completion. */
  unlocking?: boolean;
};

export function KeyEntryStep({
  loading = false,
  serverError = null,
  onUnlock,
  autoTypeKey = null,
  unlocking = false,
}: Props) {
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [autoTyping, setAutoTyping] = useState(false);
  const autoSubmittedRef = useRef(false);
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

  // Magic-type the autoTypeKey one character at a time, then auto-submit.
  // No-op if the prop is null/empty or we've already submitted.
  useEffect(() => {
    if (!autoTypeKey || autoSubmittedRef.current) return;

    if (reduce) {
      setTyped(autoTypeKey);
      autoSubmittedRef.current = true;
      onUnlock(autoTypeKey);
      return;
    }

    setAutoTyping(true);
    setTyped("");
    let i = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const tick = () => {
      i += 1;
      setTyped(autoTypeKey.slice(0, i));
      if (i >= autoTypeKey.length) {
        setAutoTyping(false);
        if (!autoSubmittedRef.current) {
          autoSubmittedRef.current = true;
          // Tiny pause so the last char is visible before the next phase.
          timer = setTimeout(() => onUnlock(autoTypeKey), 180);
        }
        return;
      }
      const jitter = Math.round((Math.random() - 0.5) * 40);
      timer = setTimeout(tick, 90 + jitter);
    };

    timer = setTimeout(tick, 250); // small lead-in
    return () => {
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoTypeKey, reduce]);

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
    <section className="text-center pt-4 sm:pt-8">
      <motion.div
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4 }}
        className="flex justify-center gap-3 mb-4 sm:mb-6"
      >
        <Doodle kind="star" color="#F6C667" size={22} drift={3.5} />
        <Doodle kind="heart" color="#FF4D8D" size={22} drift={4} />
        <Doodle kind="spark" color="#4A90E2" size={22} drift={3} />
      </motion.div>
      <motion.h1
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, delay: 0.05 }}
        className="font-display text-4xl sm:text-5xl mb-2 sm:mb-3"
      >
        A little book is waiting.
      </motion.h1>
      <motion.p
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, delay: 0.1 }}
        className="font-hand text-base sm:text-lg text-ink/70 mb-6 sm:mb-10 px-2"
      >
        Type the key the sender gave you.
      </motion.p>
      <div className="relative max-w-lg mx-auto">
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14, scale: 0.98 }}
          animate={cardControls}
          className="relative bg-paper p-6 sm:p-8"
          style={{ rotate: -0.6 }}
        >
          <RoughBox seed={88} roughness={1.9} strokeWidth={1.8} />
          <input
            type="text"
            name="note-key"
            value={typed}
            onChange={(e) => {
              if (autoTyping) return;
              setTyped(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && !autoTyping && submit()}
            placeholder="your key"
            readOnly={autoTyping}
            className={`w-full bg-transparent text-center font-display text-2xl sm:text-4xl text-ink tracking-wide placeholder-ink/25 focus:outline-none ${
              autoTyping ? "caret-transparent" : ""
            }`}
            autoFocus={!autoTyping}
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

        {/* Lock — desktop: floats just outside the right edge of the input card. */}
        <AnimatePresence>
          {unlocking && (
            <div
              key="lock-desktop"
              className="hidden sm:block absolute top-1/2 left-full -translate-y-1/2 ml-3 md:ml-5 pointer-events-none"
            >
              <LockOpen />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Lock — mobile: stacks below the input card, centered. */}
      <AnimatePresence>
        {unlocking && (
          <motion.div
            key="lock-mobile"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden mt-5 flex justify-center"
          >
            <LockOpen />
          </motion.div>
        )}
      </AnimatePresence>
      {visibleError && (
        <motion.p
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 0.25 }}
          className="font-hand text-sketchPink mt-4 sm:mt-6 max-w-lg mx-auto px-2"
        >
          {visibleError}
        </motion.p>
      )}
      <div className="mt-6 sm:mt-8">
        <button
          type="button"
          onClick={submit}
          disabled={loading || autoTyping}
          className="font-ui bg-ink text-paper px-6 sm:px-7 py-3 rounded-full hover:bg-sketchPink pencil-cursor disabled:opacity-50 text-sm sm:text-base"
        >
          {loading
            ? "Opening…"
            : autoTyping
              ? "Magic writer is typing…"
              : "Open the book →"}
        </button>
      </div>
    </section>
  );
}
