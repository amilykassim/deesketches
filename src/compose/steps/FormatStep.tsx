import type { CardFormat } from "../../lib/payload";
import { RoughBox } from "../../components/RoughBox";
import { Doodle } from "../../components/Doodle";

type Props = {
  format: CardFormat | null;
  onPick: (f: CardFormat) => void;
};

export function FormatStep({ onPick }: Props) {
  return (
    <section>
      <h1 className="font-display text-5xl text-center mb-3">
        How shall it arrive?
      </h1>
      <p className="font-hand text-lg text-center text-ink/70 mb-10">
        A digital storybook now, or a real card in the mail.
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        <Tile
          color="#FF4D8D"
          accent="heart"
          title="Digital card"
          subtitle="Unlocked by secret key"
          desc="An illustrated novella the recipient opens online — page-turn animations and all."
          onClick={() => onPick("digital")}
        />
        <Tile
          color="#4A90E2"
          accent="star"
          title="Hand-made card"
          subtitle="Mailed by Tinny notes"
          desc="The full digital story too, plus a real, hand-drawn card sent in the post."
          onClick={() => onPick("physical")}
        />
      </div>
    </section>
  );
}

function Tile({
  color,
  accent,
  title,
  subtitle,
  desc,
  onClick,
}: {
  color: string;
  accent: "heart" | "star";
  title: string;
  subtitle: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative bg-paper p-8 text-left pencil-cursor focus:outline-none transition-transform"
      style={{ transform: "rotate(-1deg)" }}
    >
      <RoughBox
        seed={11}
        roughness={1.7}
        bowing={1.4}
        strokeColor="#1a1a1a"
        strokeWidth={1.6}
      />
      <div className="absolute -top-3 -right-3">
        <Doodle kind={accent} color={color} size={32} />
      </div>
      <div
        className="font-ui text-xs uppercase tracking-wider mb-2"
        style={{ color }}
      >
        {subtitle}
      </div>
      <h2 className="font-display text-3xl mb-3">{title}</h2>
      <p className="font-hand text-ink/75">{desc}</p>
      <div className="mt-6 font-ui text-sm text-ink/60 group-hover:text-ink transition-colors">
        Choose →
      </div>
    </button>
  );
}
