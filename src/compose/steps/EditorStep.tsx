import { RoughBox } from "../../components/RoughBox";

type Chapter = { title: string; body: string };

type Props = {
  chapters: Chapter[];
  count: number;
  onChange: (chapters: Chapter[]) => void;
  onContinue: () => void;
  onBack: () => void;
};

export function EditorStep({ chapters, count, onChange, onContinue, onBack }: Props) {
  // Ensure chapters length matches count.
  const safeChapters: Chapter[] =
    chapters.length === count
      ? chapters
      : Array.from({ length: count }, (_, i) => chapters[i] ?? { title: "", body: "" });

  const update = (i: number, patch: Partial<Chapter>) => {
    const next = safeChapters.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
    onChange(next);
  };

  const ready = safeChapters.every((c) => c.title.trim() && c.body.trim());

  return (
    <section>
      <header className="text-center mb-8">
        <h2 className="font-display text-4xl mb-2">Write your chapters</h2>
        <p className="font-hand text-lg text-ink/70">
          One chapter per page. Edit until it sounds like you.
        </p>
      </header>

      <div className="space-y-6">
        {safeChapters.map((c, i) => (
          <div
            key={i}
            className="relative bg-paper p-6"
            style={{ boxShadow: "4px 4px 0 #1a1a1a18" }}
          >
            <RoughBox seed={300 + i} roughness={1.6} strokeWidth={1.5} />
            <div className="font-ui text-xs uppercase tracking-wider text-ink/55 mb-2">
              Chapter {i + 1} of {count}
            </div>
            <input
              type="text"
              value={c.title}
              onChange={(e) => update(i, { title: e.target.value })}
              placeholder="Chapter title"
              className="w-full bg-transparent font-display text-2xl text-ink placeholder-ink/30 focus:outline-none mb-3"
            />
            <textarea
              value={c.body}
              onChange={(e) => update(i, { body: e.target.value })}
              placeholder="Write the chapter here…"
              rows={5}
              className="w-full bg-transparent font-hand text-ink/85 placeholder-ink/30 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-10">
        <button type="button" onClick={onBack} className="font-ui text-ink/55 hover:text-ink">
          ← Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!ready}
          className="font-ui bg-ink text-paper px-6 py-3 rounded-full hover:bg-sketchPink pencil-cursor transition-colors disabled:opacity-50"
        >
          Continue →
        </button>
      </div>
    </section>
  );
}
