import rough from "roughjs";
import type { RoughGenerator } from "roughjs/bin/generator";

let _gen: RoughGenerator | null = null;

export function generator(): RoughGenerator {
  if (!_gen) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    _gen = rough.svg(svg).generator;
  }
  return _gen;
}

/**
 * Convert rough.js OpSet drawables to plain SVG path strings, so React can
 * render them declaratively (no DOM mutation per render).
 */
export function opsToPaths(
  drawable: ReturnType<RoughGenerator["rectangle"]>
): { d: string; stroke?: string; fill?: string }[] {
  const paths: { d: string; stroke?: string; fill?: string }[] = [];
  for (const set of drawable.sets) {
    let d = "";
    for (const op of set.ops) {
      const { op: kind, data } = op;
      if (kind === "move") d += `M${data[0]} ${data[1]} `;
      else if (kind === "lineTo") d += `L${data[0]} ${data[1]} `;
      else if (kind === "bcurveTo")
        d += `C${data[0]} ${data[1]}, ${data[2]} ${data[3]}, ${data[4]} ${data[5]} `;
    }
    if (set.type === "fillSketch") {
      paths.push({ d, stroke: "currentColor", fill: "none" });
    } else {
      paths.push({ d, stroke: "currentColor", fill: "none" });
    }
  }
  return paths;
}

export function roughRectPath(
  x: number,
  y: number,
  w: number,
  h: number,
  opts: { seed?: number; roughness?: number; bowing?: number } = {}
) {
  const g = generator();
  const drawable = g.rectangle(x, y, w, h, {
    seed: opts.seed ?? 1,
    roughness: opts.roughness ?? 1.6,
    bowing: opts.bowing ?? 1.5,
    stroke: "currentColor",
    strokeWidth: 1.8,
  });
  return opsToPaths(drawable);
}

export function roughLinePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  opts: { seed?: number; roughness?: number; bowing?: number } = {}
) {
  const g = generator();
  const drawable = g.line(x1, y1, x2, y2, {
    seed: opts.seed ?? 1,
    roughness: opts.roughness ?? 1.4,
    bowing: opts.bowing ?? 2,
    stroke: "currentColor",
    strokeWidth: 2,
  });
  return opsToPaths(drawable);
}

export function roughEllipsePath(
  cx: number,
  cy: number,
  w: number,
  h: number,
  opts: { seed?: number; roughness?: number; bowing?: number } = {}
) {
  const g = generator();
  const drawable = g.ellipse(cx, cy, w, h, {
    seed: opts.seed ?? 1,
    roughness: opts.roughness ?? 1.5,
    bowing: opts.bowing ?? 1,
    stroke: "currentColor",
    strokeWidth: 1.8,
  });
  return opsToPaths(drawable);
}
