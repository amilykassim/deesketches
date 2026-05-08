"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { RoughBox } from "./RoughBox";

type Step = {
  n: string;
  title: string;
  body: string;
  accent: string;
};

const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 500;

export function HowItWorksMobileStack({ steps }: { steps: Step[] }) {
  const [stack, setStack] = useState<Step[]>(steps);
  const [exhausted, setExhausted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const topX = useMotionValue(0);
  const topRotate = useTransform(topX, [-200, 0, 200], [-12, 0, 12]);
  const hintFiredRef = useRef(false);

  // One-shot hint on first scroll-into-view (per session).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hintFiredRef.current) return;
    if (window.sessionStorage.getItem("tn_howitworks_hint")) return;

    const node = containerRef.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !hintFiredRef.current) {
            hintFiredRef.current = true;
            window.sessionStorage.setItem("tn_howitworks_hint", "1");
            const tween = animate(topX, [0, 60, -10, 0], {
              duration: 1.0,
              times: [0, 0.6, 0.85, 1],
              ease: "easeInOut",
            });
            return () => tween.stop();
          }
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [topX]);

  const popTop = () => {
    setStack((s) => {
      const next = s.slice(1);
      if (next.length === 0) setExhausted(true);
      return next;
    });
    topX.set(0);
  };

  const reset = () => {
    setStack(steps);
    setExhausted(false);
    topX.set(0);
  };

  return (
    <div
      ref={containerRef}
      className="relative md:hidden mx-auto"
      style={{ height: 360, maxWidth: 360 }}
    >
      {exhausted ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="font-display text-3xl mb-3">That's how it works.</p>
          <button
            type="button"
            onClick={reset}
            className="font-ui text-sm border border-ink/25 px-4 py-2 rounded-full hover:bg-ink/5"
          >
            Replay
          </button>
        </div>
      ) : (
        stack
          .slice(0, 3)
          .reverse()
          .map((step, depthFromBack) => {
            const depthFromTop = stack.slice(0, 3).length - 1 - depthFromBack;
            const isTop = depthFromTop === 0;
            const offsetY = depthFromTop * 12;
            const scale = 1 - depthFromTop * 0.04;

            if (isTop) {
              return (
                <motion.div
                  key={step.n}
                  drag="x"
                  dragElastic={0.6}
                  dragConstraints={{ left: 0, right: 0 }}
                  style={{ x: topX, rotate: topRotate, zIndex: 10 - depthFromTop }}
                  onDragEnd={(_, info) => {
                    const passes =
                      Math.abs(info.offset.x) > SWIPE_THRESHOLD ||
                      Math.abs(info.velocity.x) > VELOCITY_THRESHOLD;
                    if (passes) {
                      const direction = info.offset.x > 0 ? 1 : -1;
                      animate(topX, direction * 600, {
                        duration: 0.3,
                        onComplete: popTop,
                      });
                    } else {
                      animate(topX, 0, { type: "spring", stiffness: 240, damping: 26 });
                    }
                  }}
                  className="absolute inset-0"
                >
                  <Card step={step} />
                </motion.div>
              );
            }

            return (
              <div
                key={step.n}
                className="absolute inset-0"
                style={{
                  transform: `translateY(${offsetY}px) scale(${scale})`,
                  zIndex: 10 - depthFromTop,
                  opacity: 1 - depthFromTop * 0.15,
                }}
              >
                <Card step={step} />
              </div>
            );
          })
      )}

      {!exhausted && stack.length > 0 && (
        <div className="absolute -bottom-10 inset-x-0 text-center font-ui text-xs text-ink/45">
          Swipe →
        </div>
      )}
    </div>
  );
}

function Card({ step }: { step: Step }) {
  return (
    <div
      className="relative w-full h-full bg-paper p-7"
      style={{ boxShadow: `8px 10px 0 ${step.accent}55` }}
    >
      <RoughBox seed={Number(step.n) || 20} strokeWidth={2} roughness={1.7} />
      <div className="relative flex items-baseline gap-3">
        <span className="font-display text-5xl text-ink/15 leading-none">{step.n}</span>
        <h3 className="font-display text-3xl text-ink leading-tight">{step.title}</h3>
      </div>
      <p className="relative mt-3 font-hand text-lg text-ink/75 leading-relaxed">
        {step.body}
      </p>
    </div>
  );
}
