import { useMemo } from "react";
import { roughLinePath } from "../lib/rough";

type Props = {
  color?: string;
  seed?: number;
  thickness?: number;
  className?: string;
};

export function RoughUnderline({
  color = "#FF4D8D",
  seed = 3,
  thickness = 4,
  className = "",
}: Props) {
  const paths = useMemo(() => {
    const a = roughLinePath(2, 6, 198, 6, { seed, roughness: 1.8, bowing: 3 });
    const b = roughLinePath(4, 11, 196, 11, {
      seed: seed + 11,
      roughness: 2.2,
      bowing: 4,
    });
    return [...a, ...b];
  }, [seed]);

  return (
    <svg
      className={`block w-full h-3 ${className}`}
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
          opacity={i === 0 ? 1 : 0.55}
        />
      ))}
    </svg>
  );
}
