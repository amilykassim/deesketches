import { motion } from "framer-motion";

type DoodleKind =
  | "heart"
  | "star"
  | "swirl"
  | "squiggle"
  | "spark"
  | "dot"
  | "tea"
  | "egg";

type Props = {
  kind: DoodleKind;
  color?: string;
  size?: number;
  className?: string;
  /** Optional drift animation (seconds for one full loop). 0 disables. */
  drift?: number;
  rotate?: number;
};

const PATHS: Record<DoodleKind, (color: string) => JSX.Element> = {
  heart: (color) => (
    <path
      d="M12 21 C 4 14, 4 7, 8 5 C 11 4, 12 7, 12 7 C 12 7, 13 4, 16 5 C 20 7, 20 14, 12 21 Z"
      fill={color}
      stroke={color}
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  ),
  star: (color) => (
    <path
      d="M12 3 L14 10 L21 11 L15.5 15.5 L17.5 22 L12 18 L6.5 22 L8.5 15.5 L3 11 L10 10 Z"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  ),
  swirl: (color) => (
    <path
      d="M3 18 C 6 8, 14 4, 20 10 C 23 13, 19 19, 14 17 C 11 15.5, 12 11, 16 12"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  ),
  squiggle: (color) => (
    <path
      d="M2 12 Q 6 4, 10 12 T 18 12 T 26 12"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  ),
  spark: (color) => (
    <g fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 3 L12 9" />
      <path d="M12 15 L12 21" />
      <path d="M3 12 L9 12" />
      <path d="M15 12 L21 12" />
      <path d="M6 6 L9.5 9.5" />
      <path d="M14.5 14.5 L18 18" />
      <path d="M18 6 L14.5 9.5" />
      <path d="M9.5 14.5 L6 18" />
    </g>
  ),
  dot: (color) => <circle cx="12" cy="12" r="3" fill={color} />,
  tea: (color) => (
    <g fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round">
      <path d="M5 8 L19 8 L17 20 L7 20 Z" />
      <path d="M11 4 Q 13 6, 11 8" strokeLinecap="round" />
      <rect x="10" y="11" width="4" height="6" fill="#FF8A3C" stroke="none" />
    </g>
  ),
  egg: (color) => (
    <g fill="none" stroke={color} strokeWidth="1.6">
      <path d="M12 3 C 18 3, 22 14, 16 20 C 10 24, 4 18, 6 11 C 7 6, 9 3, 12 3 Z" />
      <circle cx="12" cy="13" r="3" fill="#F6C667" stroke="none" />
    </g>
  ),
};

export function Doodle({
  kind,
  color = "#1a1a1a",
  size = 28,
  className = "",
  drift = 0,
  rotate = 0,
}: Props) {
  const inner = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      {PATHS[kind](color)}
    </svg>
  );

  if (!drift) return <span className={className}>{inner}</span>;

  return (
    <motion.span
      className={className}
      animate={{
        y: [0, -10, 0, 8, 0],
        rotate: [rotate - 6, rotate + 6, rotate - 4, rotate + 5, rotate - 6],
      }}
      transition={{ duration: drift, ease: "easeInOut", repeat: Infinity }}
    >
      {inner}
    </motion.span>
  );
}
