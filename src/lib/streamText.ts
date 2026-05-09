"use client";

import { useEffect, useState } from "react";

const PER_TICK_BASE = 3; // characters revealed per frame
const TICK_INTERVAL_MS = 30;

export type StreamState = {
  visible: string;
  isStreaming: boolean;
  skip: () => void;
};

/**
 * Reveals `text` progressively at ~30ms / 3-char cadence to feel like
 * fluent writing rather than a printer. Honors prefers-reduced-motion
 * by completing instantly. Cancellation safe: changing `text` resets.
 */
export function useStreamText(
  text: string,
  enabled: boolean,
  reset: number,
): StreamState {
  const [progress, setProgress] = useState(enabled ? 0 : text.length);
  const [done, setDone] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setProgress(text.length);
      setDone(true);
      return;
    }
    setProgress(0);
    setDone(false);

    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setProgress(text.length);
      setDone(true);
      return;
    }

    let cancelled = false;
    const start = performance.now();
    const total = text.length;

    const interval = window.setInterval(() => {
      if (cancelled) return;
      const elapsed = performance.now() - start;
      const target = Math.min(
        total,
        Math.floor((elapsed / TICK_INTERVAL_MS) * PER_TICK_BASE),
      );
      setProgress(target);
      if (target >= total) {
        window.clearInterval(interval);
        setDone(true);
      }
    }, TICK_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, enabled, reset]);

  return {
    visible: text.slice(0, progress),
    isStreaming: !done,
    skip: () => {
      setProgress(text.length);
      setDone(true);
    },
  };
}
