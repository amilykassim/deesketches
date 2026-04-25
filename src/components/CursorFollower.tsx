import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useState } from "react";

/**
 * A small spring-tracked dot that follows the pointer.
 * - Disabled on touch / coarse-pointer devices.
 * - Disabled if user prefers reduced motion.
 * - Uses transform only (GPU-accelerated, no layout work).
 */
export function CursorFollower() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hot, setHot] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { damping: 22, stiffness: 260, mass: 0.5 });
  const sy = useSpring(y, { damping: 22, stiffness: 260, mass: 0.5 });

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const interactive =
        !!t?.closest("button, a, [data-magnetic], input, textarea, label");
      setHot(interactive);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[60] mix-blend-multiply"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        animate={{
          scale: hot ? 2.6 : 1,
          backgroundColor: hot ? "rgba(255,77,141,0.18)" : "#FF4D8D",
          borderColor: hot ? "#FF4D8D" : "transparent",
        }}
        transition={{ type: "spring", damping: 18, stiffness: 280 }}
        style={{
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform",
        }}
        className="w-3 h-3 rounded-full border-2"
      />
    </motion.div>
  );
}
