import { motion, useReducedMotion } from "framer-motion";

type Props = {
  color?: string;
  className?: string;
  /** seed shifts the wave phase so adjacent dividers don't look identical */
  seed?: number;
};

/**
 * Section divider: a hand-drawn squiggle that "draws itself" via SVG
 * `pathLength` when scrolled into view. One path = one stroke = no layout work.
 */
export function DrawnSquiggle({ color = "#1a1a1a", className = "", seed = 0 }: Props) {
  const reduce = useReducedMotion();
  // Build a wavy path with a few phase-offset bumps based on seed
  const phase = (seed % 4) * 30;
  const d = `M0 16 Q ${100 + phase} 2, 200 16 T 400 16 T 600 16 T 800 16 T 1000 16 T 1200 16`;

  return (
    <div className={`relative w-full py-4 ${className}`} aria-hidden>
      <svg
        viewBox="0 0 1200 32"
        className="block w-full h-8"
        preserveAspectRatio="none"
      >
        <motion.path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={reduce ? undefined : { pathLength: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
