import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

type Props = HTMLMotionProps<"div"> & {
  children: ReactNode;
  amount?: number;
};

export function Wobble({ children, amount = 1.5, ...rest }: Props) {
  return (
    <motion.div
      whileHover={{ rotate: [0, -amount, amount, -amount, 0], scale: 1.03 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
