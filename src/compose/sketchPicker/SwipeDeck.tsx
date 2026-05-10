"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  PanInfo,
  animate,
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import type { Sketch } from "../../data/sketches";
import { RoughBox } from "../../components/RoughBox";

const SWIPE_THRESHOLD = 110;
const VELOCITY_THRESHOLD = 480;

type Props = {
  deck: Sketch[];
  full: boolean;
  onSelect: (sketch: Sketch) => void;
  onSkip: (sketch: Sketch) => void;
};

export function SwipeDeck({ deck, full, onSelect, onSkip }: Props) {
  if (deck.length === 0) {
    return (
      <div className="relative mx-auto w-full max-w-sm h-[420px] flex items-center justify-center text-center">
        <div className="bg-paper p-8 relative w-full">
          <RoughBox seed={222} roughness={1.6} strokeWidth={1.4} />
          <p className="font-display text-3xl mb-2 text-ink/85">All done!</p>
          <p className="font-hand text-base text-ink/65">
            You've gone through every sketch in this set.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="relative h-[440px]">
        <AnimatePresence initial={false}>
          {deck
            .slice(0, 3)
            .reverse()
            .map((sketch, depthFromBack) => {
              const depthFromTop = Math.min(deck.length, 3) - 1 - depthFromBack;
              const isTop = depthFromTop === 0;
              return (
                <DeckCard
                  key={sketch.id}
                  sketch={sketch}
                  depthFromTop={depthFromTop}
                  isTop={isTop}
                  full={full && isTop}
                  onSelect={() => onSelect(sketch)}
                  onSkip={() => onSkip(sketch)}
                />
              );
            })}
        </AnimatePresence>
      </div>
      <p className="mt-4 text-center font-hand text-base text-ink/65">
        <span aria-hidden="true">← swipe →</span>{" "}
        <span>or tap a card to pick</span>
      </p>
    </div>
  );
}

function DeckCard({
  sketch,
  depthFromTop,
  isTop,
  full,
  onSelect,
  onSkip,
}: {
  sketch: Sketch;
  depthFromTop: number;
  isTop: boolean;
  full: boolean;
  onSelect: () => void;
  onSkip: () => void;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-12, 0, 12]);
  const skipOpacity = useTransform(x, [-180, -40, 0], [1, 0.4, 0]);
  const selectOpacity = useTransform(x, [0, 40, 180], [0, 0.4, 1]);
  const [exiting, setExiting] = useState<null | "select" | "skip">(null);
  const draggedRef = useRef(false);

  const offsetY = depthFromTop * 10;
  const scale = 1 - depthFromTop * 0.04;
  const baseOpacity = 1 - depthFromTop * 0.12;

  // One-shot wobble hint on the top card so users see it can be swiped.
  useEffect(() => {
    if (!isTop || reduce || exiting) return;
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem("tn_swipedeck_hint")) return;
    window.sessionStorage.setItem("tn_swipedeck_hint", "1");
    const tween = animate(x, [0, 60, -40, 20, 0], {
      duration: 1.1,
      times: [0, 0.35, 0.65, 0.85, 1],
      ease: "easeInOut",
      delay: 0.3,
    });
    return () => tween.stop();
  }, [isTop, reduce, exiting, x]);

  const handleDragStart = () => {
    draggedRef.current = true;
  };

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    const passes =
      Math.abs(info.offset.x) > SWIPE_THRESHOLD ||
      Math.abs(info.velocity.x) > VELOCITY_THRESHOLD;
    // Reset the "did drag" guard slightly later so the trailing onTap doesn't
    // misfire as a click.
    setTimeout(() => {
      draggedRef.current = false;
    }, 50);
    if (!passes) {
      x.set(0);
      return;
    }
    const direction: "select" | "skip" = info.offset.x > 0 ? "select" : "skip";
    if (direction === "select" && full) {
      x.set(0);
      return;
    }
    setExiting(direction);
  };

  const handleTap = () => {
    if (!isTop || exiting || full) return;
    if (draggedRef.current) return;
    onSelect();
  };

  const onExitComplete = (which: "select" | "skip") => {
    if (which === "select") onSelect();
    else onSkip();
  };

  return (
    <motion.div
      key={sketch.id}
      drag={isTop && !exiting ? "x" : false}
      dragElastic={0.6}
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTap={isTop ? handleTap : undefined}
      style={{
        x,
        rotate: isTop ? rotate : 0,
        zIndex: 10 - depthFromTop,
        cursor: isTop && !full ? "pointer" : undefined,
      }}
      initial={
        reduce
          ? { opacity: baseOpacity, y: offsetY, scale }
          : { opacity: 0, y: offsetY + 20, scale: scale * 0.95 }
      }
      animate={
        exiting
          ? {
              x: exiting === "select" ? 600 : -600,
              rotate: exiting === "select" ? 24 : -24,
              opacity: 0,
              transition: { duration: reduce ? 0 : 0.32, ease: "easeIn" },
            }
          : {
              opacity: baseOpacity,
              y: offsetY,
              scale,
              transition: reduce
                ? { duration: 0 }
                : { type: "spring", damping: 26, stiffness: 220 },
            }
      }
      exit={{ opacity: 0 }}
      onAnimationComplete={() => exiting && onExitComplete(exiting)}
      className="absolute inset-0"
      role={isTop ? "button" : undefined}
      aria-label={isTop ? `Pick ${sketch.title}` : undefined}
    >
      <div
        className="relative w-full h-full bg-paper p-5"
        style={{ boxShadow: `8px 12px 0 ${sketch.accent}33` }}
      >
        <RoughBox seed={500 + sketch.id.length} strokeWidth={1.6} roughness={1.6} />

        {isTop && (
          <>
            <motion.div
              style={{ opacity: skipOpacity }}
              className="absolute top-6 right-6 z-20 font-ui text-base uppercase tracking-[0.2em] text-sketchPink border-2 border-sketchPink rounded-md px-3 py-1 -rotate-12"
            >
              Skip
            </motion.div>
            <motion.div
              style={{ opacity: selectOpacity }}
              className="absolute top-6 left-6 z-20 font-ui text-base uppercase tracking-[0.2em] text-sketchGreen border-2 border-sketchGreen rounded-md px-3 py-1 rotate-12"
            >
              Pick
            </motion.div>
          </>
        )}

        <div className="relative aspect-[4/3] overflow-hidden bg-paper">
          {sketch.Component && <sketch.Component />}
        </div>
        <div className="relative mt-3">
          <h3 className="font-display text-2xl text-ink leading-tight">{sketch.title}</h3>
          <p className="font-hand text-base text-ink/70 mt-1">{sketch.pun}</p>
        </div>
      </div>
    </motion.div>
  );
}
