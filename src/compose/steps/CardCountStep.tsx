import type { Category } from "../../data/sketches";
import { sketches } from "../../data/sketches";
import { RoughBox } from "../../components/RoughBox";
import { BackButton } from "./OccasionStep";

type Props = {
  category: Category;
  count: number;
  onPick: (n: number) => void;
  onBack: () => void;
};

export function CardCountStep({ category, onPick, onBack }: Props) {
  const available = sketches.filter((s) => s.category === category).length;
  const max = Math.min(5, Math.max(1, available));
  const choices = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <section>
      <BackButton onClick={onBack} />
      <h1 className="font-display text-5xl text-center mb-3">
        How many cards?
      </h1>
      <p className="font-hand text-lg text-center text-ink/70 mb-10">
        One stand-alone vignette, or up to five chapters of a small novella.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {choices.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPick(n)}
            className="relative bg-paper py-8 text-center pencil-cursor focus:outline-none"
            style={{ transform: `rotate(${(n % 2 === 0 ? -1 : 1) * (1 + (n % 3))}deg)` }}
          >
            <RoughBox seed={20 + n} strokeColor="#1a1a1a" strokeWidth={1.5} />
            <div className="font-display text-6xl">{n}</div>
            <div className="font-ui text-xs uppercase tracking-wider text-ink/60 mt-1">
              {n === 1 ? "vignette" : `${n} chapters`}
            </div>
          </button>
        ))}
      </div>
      {max < 5 && (
        <p className="font-hand text-sm text-center text-ink/55 mt-6">
          ({category} has {available} sketches today — capped at {max}.)
        </p>
      )}
    </section>
  );
}
