import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { Doodle } from "./Doodle";

type Props = {
  /** flips true once → triggers a single burst, then false to allow next */
  trigger: number;
};

const KINDS = ["heart", "star", "spark", "swirl", "squiggle"] as const;
const COLORS = ["#FF4D8D", "#F6C667", "#4A90E2", "#FF8A3C", "#6FCF97"];

/**
 * Spawns ~10 doodle particles flying outward from origin, fading out.
 * Each particle is a separate `motion` element animating transform/opacity —
 * no layout work, removed from DOM after exit.
 */
export function ConfettiBurst({ trigger }: Props) {
  const reduce = useReducedMotion();

  // Recompute particle vectors when trigger changes — useMemo keyed by trigger
  const particles = useMemo(() => {
    if (reduce) return [];
    const N = 10;
    return Array.from({ length: N }, (_, i) => {
      const angle = (i / N) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const dist = 90 + Math.random() * 70;
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        kind: KINDS[i % KINDS.length],
        color: COLORS[i % COLORS.length],
        rot: Math.random() * 360 - 180,
        size: 18 + Math.round(Math.random() * 10),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  if (reduce) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 grid place-items-center z-30"
      aria-hidden
    >
      <AnimatePresence>
        {trigger > 0 && (
          <motion.div
            key={trigger}
            className="relative"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {particles.map((p) => (
              <motion.span
                key={p.id}
                className="absolute"
                style={{ willChange: "transform, opacity" }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  opacity: 0,
                  scale: 1,
                  rotate: p.rot,
                }}
                transition={{ duration: 0.95, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <Doodle kind={p.kind} color={p.color} size={p.size} />
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
