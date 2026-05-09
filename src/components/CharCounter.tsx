import type { CharCount } from "../lib/useCharCount";

type Props = {
  state: CharCount;
  className?: string;
  alwaysShow?: boolean;
};

export function CharCounter({ state, className = "", alwaysShow = false }: Props) {
  if (!alwaysShow && !state.near) return null;
  return (
    <span
      aria-live="polite"
      className={`font-ui text-xs tabular-nums ${
        state.over
          ? "text-sketchPink"
          : state.near
          ? "text-ink/65"
          : "text-ink/45"
      } ${className}`}
    >
      {state.count} / {state.max}
    </span>
  );
}
