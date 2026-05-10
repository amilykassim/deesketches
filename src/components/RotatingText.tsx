"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Props = {
  messages: string[];
  intervalMs?: number;
  className?: string;
};

export function RotatingText({ messages, intervalMs = 2000, className = "" }: Props) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (messages.length < 2) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, intervalMs);
    return () => window.clearInterval(t);
  }, [messages.length, intervalMs]);

  const transition = reduce
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <span
      className={`relative inline-grid align-middle leading-none ${className}`}
      aria-live="polite"
    >
      {messages.map((m, i) => (
        <span
          key={`size-${i}`}
          aria-hidden
          className="invisible whitespace-nowrap col-start-1 row-start-1"
        >
          {m}
        </span>
      ))}
      <span className="col-start-1 row-start-1 relative overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={index}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={transition}
            className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
          >
            {messages[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
