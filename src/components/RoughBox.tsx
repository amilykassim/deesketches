import { useMemo } from "react";
import { roughRectPath } from "../lib/rough";
import { useIsMounted } from "../lib/use-is-mounted";

type Props = {
  seed?: number;
  roughness?: number;
  bowing?: number;
  className?: string;
  strokeColor?: string;
  fill?: string;
  strokeWidth?: number;
  /** Inset the rect from the SVG edges so the rough strokes don't clip. */
  inset?: number;
  /** Render the rect at this aspect (purely for the internal viewBox; element fills its parent). */
  width?: number;
  height?: number;
};

/**
 * Absolute SVG overlay that paints a sketchy rectangle border filling
 * its parent. The parent must be `position: relative`.
 */
export function RoughBox({
  seed = 7,
  roughness = 1.6,
  bowing = 1.4,
  className = "",
  strokeColor = "#1a1a1a",
  fill,
  strokeWidth = 1.8,
  inset = 6,
  width = 300,
  height = 200,
}: Props) {
  const mounted = useIsMounted();
  const paths = useMemo(
    () =>
      mounted
        ? roughRectPath(inset, inset, width - inset * 2, height - inset * 2, {
            seed,
            roughness,
            bowing,
          })
        : [],
    [seed, roughness, bowing, inset, width, height, mounted]
  );

  return (
    <svg
      className={`absolute inset-0 h-full w-full pointer-events-none ${className}`}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{ color: strokeColor }}
      aria-hidden="true"
    >
      {fill && (
        <rect
          x={inset}
          y={inset}
          width={width - inset * 2}
          height={height - inset * 2}
          fill={fill}
        />
      )}
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}
    </svg>
  );
}
