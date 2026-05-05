import type { Category } from "../../data/sketches";
import { categories } from "../../data/sketches";
import { RoughBox } from "../../components/RoughBox";

type Props = {
  category: Category | null;
  onPick: (c: Category) => void;
  onBack: () => void;
};

const BLURB: Record<Category, string> = {
  Birthday: "Candles, parades, and small lanterns.",
  Love: "Pockets full of sky.",
  Friendship: "The bench at the end of the road.",
  Puns: "Silly, snack-shaped adventures.",
  Custom: "Toasts, thank-yous, and rooting-for-yous.",
};

const COLOR: Record<Category, string> = {
  Birthday: "#FF8A3C",
  Love: "#FF4D8D",
  Friendship: "#4A90E2",
  Puns: "#6FCF97",
  Custom: "#B8A6E0",
};

export function OccasionStep({ onPick, onBack }: Props) {
  return (
    <section>
      <BackButton onClick={onBack} />
      <h1 className="font-display text-5xl text-center mb-3">
        What's the occasion?
      </h1>
      <p className="font-hand text-lg text-center text-ink/70 mb-10">
        Each category has its own little library of stories.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((c, i) => (
          <button
            key={c}
            type="button"
            onClick={() => onPick(c)}
            className="relative bg-paper p-6 text-left pencil-cursor focus:outline-none"
            style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}
          >
            <RoughBox seed={5 + i} strokeColor="#1a1a1a" strokeWidth={1.6} />
            <div
              className="font-ui text-xs uppercase tracking-wider mb-2"
              style={{ color: COLOR[c] }}
            >
              Occasion
            </div>
            <h2 className="font-display text-3xl">{c}</h2>
            <p className="font-hand text-ink/75 mt-2">{BLURB[c]}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-ui text-sm text-ink/60 hover:text-ink mb-4 inline-flex items-center gap-1 pencil-cursor"
    >
      ← Back
    </button>
  );
}
