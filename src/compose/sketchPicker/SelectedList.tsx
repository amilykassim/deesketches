"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Sketch } from "../../data/sketches";
import { RoughBox } from "../../components/RoughBox";

type Props = {
  selected: Sketch[];
  count: number;
  onMove: (from: number, to: number) => void;
  onRemove: (id: string) => void;
};

export function SelectedList({ selected, count, onMove, onRemove }: Props) {
  const reduce = useReducedMotion();
  return (
    <div className="mt-8">
      <div className="font-ui text-xs uppercase tracking-wider text-ink/55 mb-3 text-center">
        Reading order · {selected.length} of {count}
      </div>
      <motion.div
        layout={!reduce}
        className="flex flex-wrap gap-3 justify-center min-h-[40px]"
      >
        <AnimatePresence>
          {selected.map((sk, i) => (
            <motion.div
              layout={!reduce}
              key={sk.id}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: -16, scale: 0.85 }}
              animate={
                reduce
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, scale: 1, rotate: i % 2 === 0 ? -2 : 2 }
              }
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { type: "spring", damping: 24, stiffness: 280 }
              }
              className="relative bg-paper p-2 w-32 group"
            >
              <RoughBox seed={50 + i} strokeColor="#1a1a1a" strokeWidth={1.4} />
              <button
                type="button"
                onClick={() => onRemove(sk.id)}
                className="absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full bg-paper border-2 border-sketchPink text-sketchPink font-display text-base leading-none flex items-center justify-center pencil-cursor hover:bg-sketchPink hover:text-paper transition-colors shadow-sm"
                aria-label={`Cancel ${sk.title} and pick another`}
                title="Cancel & pick another"
              >
                ×
              </button>
              <div className="aspect-[4/3] overflow-hidden">
                {sk.Component && <sk.Component />}
              </div>
              <div className="font-display text-base text-center mt-1 truncate">
                {i + 1}. {sk.title}
              </div>
              <div className="flex justify-between mt-1 text-xs">
                <button
                  type="button"
                  onClick={() => onMove(i, i - 1)}
                  className="font-ui text-ink/60 hover:text-ink px-1 disabled:opacity-30"
                  disabled={i === 0}
                  aria-label={`Move ${sk.title} left`}
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => onMove(i, i + 1)}
                  className="font-ui text-ink/60 hover:text-ink px-1 disabled:opacity-30"
                  disabled={i === selected.length - 1}
                  aria-label={`Move ${sk.title} right`}
                >
                  →
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
