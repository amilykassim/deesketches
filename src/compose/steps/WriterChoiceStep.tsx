import { RoughBox } from "../../components/RoughBox";

type Props = {
  onPick: (source: "self" | "magic_writer") => void;
  onBack: () => void;
};

export function WriterChoiceStep({ onPick, onBack }: Props) {
  return (
    <section className="text-center">
      <h2 className="font-display text-4xl mb-2">Who's writing this?</h2>
      <p className="font-hand text-lg text-ink/70 mb-10">
        You can write the chapters yourself, or let Magic Writer pull a draft you can edit.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Choice
          title="Write it myself"
          subtitle="Open an empty editor. Type each chapter."
          accent="#4A90E2"
          onClick={() => onPick("self")}
        />
        <Choice
          title="Use Magic Writer"
          subtitle="We pre-fill a story for this category. You can edit every word."
          accent="#FF4D8D"
          onClick={() => onPick("magic_writer")}
        />
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-10 font-ui text-ink/55 hover:text-ink"
      >
        ← Back
      </button>
    </section>
  );
}

function Choice({
  title,
  subtitle,
  accent,
  onClick,
}: {
  title: string;
  subtitle: string;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative bg-paper p-8 text-left pencil-cursor hover:-translate-y-1 transition-transform"
      style={{ boxShadow: `6px 6px 0 ${accent}` }}
    >
      <RoughBox seed={Math.floor(Math.random() * 1000)} roughness={1.6} strokeWidth={1.6} />
      <h3 className="font-display text-2xl mb-2">{title}</h3>
      <p className="font-hand text-ink/70">{subtitle}</p>
    </button>
  );
}
