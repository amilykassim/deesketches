import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** ms of stagger when several siblings reveal */
  delay?: number;
  /** "left" wipes L→R, "up" wipes bottom→top */
  direction?: "left" | "up";
};

/**
 * Wipes content into view via animated `clip-path`. clip-path is composited,
 * so the reveal stays on the GPU and never re-lays out the page.
 */
export function InkReveal({
  children,
  className = "",
  delay = 0,
  direction = "left",
}: Props) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  const initial =
    direction === "left"
      ? { clipPath: "inset(0 100% 0 0)" }
      : { clipPath: "inset(100% 0 0 0)" };

  return (
    <motion.div
      className={className}
      style={{ willChange: "clip-path" }}
      initial={initial}
      animate={{ clipPath: "inset(0 0 0 0)" }}
      transition={{ duration: 0.95, ease: [0.4, 0, 0.2, 1], delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  );
}
