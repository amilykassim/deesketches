import type { Category, Sketch } from "../../data/sketches";
import { RoughBox } from "../../components/RoughBox";
import { BackButton } from "./OccasionStep";

type Props = {
  category: Category;
  count: number;
  cardIds: string[];
  onChange: (ids: string[]) => void;
  onContinue: () => void;
  onBack: () => void;
  allSketches: Sketch[];
};

export function SketchPickStep({
  category,
  count,
  cardIds,
  onChange,
  onContinue,
  onBack,
  allSketches,
}: Props) {
  const pool = allSketches.filter((s) => s.category === category);

  const toggle = (id: string) => {
    const idx = cardIds.indexOf(id);
    if (idx >= 0) {
      onChange(cardIds.filter((_, i) => i !== idx));
    } else if (cardIds.length < count) {
      onChange([...cardIds, id]);
    }
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= cardIds.length) return;
    const next = [...cardIds];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <section>
      <BackButton onClick={onBack} />
      <h1 className="font-display text-5xl text-center mb-3">
        Pick {count} sketch{count > 1 ? "es" : ""}
      </h1>
      <p className="font-hand text-lg text-center text-ink/70 mb-2">
        The order you pick is the order they're read.
      </p>
      <p className="font-ui text-xs text-center text-ink/55 mb-8">
        {cardIds.length} of {count} chosen
      </p>

      {cardIds.length > 0 && (
        <div className="mb-8">
          <div className="font-ui text-xs uppercase tracking-wider text-ink/55 mb-3 text-center">
            Reading order
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {cardIds.map((id, i) => {
              const sk = pool.find((s) => s.id === id);
              if (!sk) return null;
              return (
                <div
                  key={`${id}-${i}`}
                  className="relative bg-paper p-2 w-32 pencil-cursor"
                  style={{ transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)` }}
                >
                  <RoughBox seed={50 + i} strokeColor="#1a1a1a" strokeWidth={1.4} />
                  <div className="aspect-[4/3] overflow-hidden">
                    {sk.Component && <sk.Component />}
                  </div>
                  <div className="font-display text-base text-center mt-1 truncate">
                    {i + 1}. {sk.title}
                  </div>
                  <div className="flex justify-between mt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => move(i, i - 1)}
                      className="font-ui text-ink/60 hover:text-ink px-1"
                      disabled={i === 0}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => toggle(id)}
                      className="font-ui text-ink/60 hover:text-sketchPink px-1"
                    >
                      remove
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, i + 1)}
                      className="font-ui text-ink/60 hover:text-ink px-1"
                      disabled={i === cardIds.length - 1}
                    >
                      →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pool.map((s, i) => {
          const picked = cardIds.includes(s.id);
          const full = cardIds.length >= count && !picked;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => toggle(s.id)}
              disabled={full}
              className="relative bg-paper p-3 text-left pencil-cursor focus:outline-none disabled:opacity-40"
              style={{
                transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)`,
                boxShadow: picked
                  ? `6px 8px 0 ${s.accent}66`
                  : "4px 6px 0 rgba(26,26,26,0.10)",
                transition: "box-shadow 0.3s",
              }}
            >
              <RoughBox seed={30 + i} strokeColor="#1a1a1a" strokeWidth={1.4} />
              <div className="aspect-[4/3] overflow-hidden">
                {s.Component && <s.Component />}
              </div>
              <div className="mt-2 font-display text-xl">{s.title}</div>
              <div className="font-hand text-xs text-ink/65">{s.pun}</div>
              {picked && (
                <div className="absolute -top-2 -right-2 bg-ink text-paper rounded-full w-7 h-7 flex items-center justify-center font-ui text-xs">
                  {cardIds.indexOf(s.id) + 1}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center mt-10">
        <button
          type="button"
          disabled={cardIds.length !== count}
          onClick={onContinue}
          className="font-ui bg-ink text-paper px-7 py-3 rounded-full hover:bg-sketchPink disabled:opacity-30 disabled:cursor-not-allowed pencil-cursor transition-colors"
        >
          Conjure the story →
        </button>
      </div>
    </section>
  );
}
