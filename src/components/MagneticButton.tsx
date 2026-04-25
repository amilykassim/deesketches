import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import { useRef } from "react";

type Props = HTMLMotionProps<"div"> & {
  /** how far the element drifts toward the cursor (0–0.6 looks good) */
  strength?: number;
};

/**
 * Wraps a child element so it drifts toward the cursor while hovered.
 * Pure transform / GPU. Re-centers on leave via spring.
 */
export function MagneticButton({
  children,
  strength = 0.28,
  className = "",
  ...rest
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 14, stiffness: 220, mass: 0.5 });
  const sy = useSpring(y, { damping: 14, stiffness: 220, mass: 0.5 });

  return (
    <motion.div
      ref={ref}
      data-magnetic
      onPointerMove={(e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x: sx, y: sy, willChange: "transform" }}
      className={`inline-block ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
