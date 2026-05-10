"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Doodle } from "../components/Doodle";

/**
 * Brief lock-opening flourish. Renders inline — caller is responsible for
 * positioning. Pure visual; the parent owns timing and unmounts when it
 * transitions to the next state.
 */
export function LockOpen() {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative inline-block"
        aria-hidden
      >
        <LockSvg />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
      animate={{
        opacity: [0, 1, 1, 1],
        scale: [0.85, 1, 1.05, 1],
        rotate: [-4, 2, -1, 0],
      }}
      exit={{ opacity: 0, scale: 1.15 }}
      transition={{
        duration: 0.9,
        times: [0, 0.22, 0.7, 1],
        ease: "easeOut",
      }}
      className="relative inline-block"
      aria-hidden
    >
      <LockSvg />
      {/* Sparks fly off the keyhole as the shackle pops. */}
      <motion.span
        className="absolute pointer-events-none"
        style={{ left: 28, top: -2 }}
        initial={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
        animate={{ opacity: [0, 1, 0], scale: 1, x: -18, y: -22 }}
        transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
      >
        <Doodle kind="spark" color="#F6C667" size={16} />
      </motion.span>
      <motion.span
        className="absolute pointer-events-none"
        style={{ left: 28, top: -2 }}
        initial={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
        animate={{ opacity: [0, 1, 0], scale: 1, x: 20, y: -18 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      >
        <Doodle kind="star" color="#FF4D8D" size={14} />
      </motion.span>
    </motion.div>
  );
}

function LockSvg() {
  // 88×102 — sized to sit comfortably next to a text input on both
  // mobile and desktop without crowding the layout.
  return (
    <svg
      width="88"
      height="102"
      viewBox="0 0 120 140"
      fill="none"
      stroke="#1a1a1a"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* shackle */}
      <motion.g
        initial={{ rotate: 0, y: 0 }}
        animate={{ rotate: -38, y: -4 }}
        transition={{ duration: 0.45, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ transformOrigin: "78px 50px" }}
      >
        <path d="M30 50 V32 a30 30 0 0 1 60 0 V50" fill="none" />
      </motion.g>
      {/* body */}
      <rect
        x="20"
        y="50"
        width="80"
        height="72"
        rx="10"
        fill="#FBF7F0"
      />
      {/* keyhole */}
      <circle cx="60" cy="80" r="6" fill="#1a1a1a" />
      <path d="M60 84 L60 96" stroke="#1a1a1a" strokeWidth={4} />
    </svg>
  );
}
