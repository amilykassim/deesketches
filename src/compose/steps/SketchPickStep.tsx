"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Category, Sketch } from "../../data/sketches";
import { categories } from "../../data/sketches";
import { SwipeDeck } from "../sketchPicker/SwipeDeck";
import { SelectedList } from "../sketchPicker/SelectedList";
import { BackButton } from "./OccasionStep";

type Props = {
  category: Category;
  count: number;
  cardIds: string[];
  onChange: (ids: string[]) => void;
  onChangeCategory: (c: Category) => void;
  onContinue: () => void;
  onBack: () => void;
  allSketches: Sketch[];
};

export function SketchPickStep({
  category,
  count,
  cardIds,
  onChange,
  onChangeCategory,
  onContinue,
  onBack,
  allSketches,
}: Props) {
  const pool = useMemo(
    () => allSketches.filter((s) => s.category === category),
    [allSketches, category],
  );
  const [skippedIds, setSkippedIds] = useState<string[]>([]);
  const [reshuffleKey, setReshuffleKey] = useState(0);

  const selected = useMemo(
    () =>
      cardIds
        .map((id) => pool.find((s) => s.id === id))
        .filter((s): s is Sketch => !!s),
    [cardIds, pool],
  );

  const deck = useMemo(
    () =>
      pool.filter(
        (s) => !cardIds.includes(s.id) && !skippedIds.includes(s.id),
      ),
    // reshuffleKey lets the user reset the deck when they exhaust it without
    // enough picks; the dependency is intentional so React recomputes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pool, cardIds, skippedIds, reshuffleKey],
  );

  const full = cardIds.length >= count;
  const handleSelect = (sketch: Sketch) => {
    if (full) return;
    if (cardIds.includes(sketch.id)) return;
    onChange([...cardIds, sketch.id]);
  };

  const handleSkip = (sketch: Sketch) => {
    setSkippedIds((s) => (s.includes(sketch.id) ? s : [...s, sketch.id]));
  };

  const handleRemove = (id: string) => {
    onChange(cardIds.filter((cid) => cid !== id));
  };

  const handleMove = (from: number, to: number) => {
    if (to < 0 || to >= cardIds.length) return;
    const next = [...cardIds];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  const reshuffle = () => {
    setSkippedIds([]);
    setReshuffleKey((k) => k + 1);
  };

  // Top card on the deck (if any) — used by the on-screen buttons.
  const topCard = deck[0];

  return (
    <section>
      <BackButton onClick={onBack} />
      <h1 className="font-display text-5xl text-center mb-3">
        Pick {count} sketch{count > 1 ? "es" : ""}
      </h1>
      <p className="font-hand text-lg text-center text-ink/70 mb-2">
        Swipe right to pick · left to skip · order them below.
      </p>
      <p className="font-ui text-sm text-center text-ink/55 mb-6">
        {cardIds.length} of {count} chosen
      </p>

      <CategoryStrip
        active={category}
        onPick={(c) => {
          if (c === category) return;
          setSkippedIds([]);
          onChangeCategory(c);
        }}
      />

      <SwipeDeck
        deck={deck}
        full={full}
        onSelect={handleSelect}
        onSkip={handleSkip}
      />

      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          type="button"
          onClick={() => topCard && handleSkip(topCard)}
          disabled={!topCard}
          className="w-14 h-14 rounded-full border-2 border-ink/30 bg-paper text-ink hover:bg-ink/5 disabled:opacity-30 disabled:cursor-not-allowed font-display text-2xl pencil-cursor"
          aria-label="Skip this sketch"
        >
          ✕
        </button>
        {skippedIds.length > 0 && deck.length === 0 && !full && (
          <button
            type="button"
            onClick={reshuffle}
            className="font-ui text-sm border border-ink/25 px-4 py-2 rounded-full hover:bg-ink/5 pencil-cursor"
          >
            Reshuffle skipped ({skippedIds.length})
          </button>
        )}
        <button
          type="button"
          onClick={() => topCard && handleSelect(topCard)}
          disabled={!topCard || full}
          className="w-14 h-14 rounded-full border-2 border-sketchGreen bg-sketchGreen/15 text-ink hover:bg-sketchGreen/25 disabled:opacity-30 disabled:cursor-not-allowed font-display text-2xl pencil-cursor"
          aria-label="Pick this sketch"
        >
          ♥
        </button>
      </div>

      <SelectedList
        selected={selected}
        count={count}
        onMove={handleMove}
        onRemove={handleRemove}
      />

      <div className="flex justify-center mt-10">
        <button
          type="button"
          disabled={cardIds.length !== count}
          onClick={onContinue}
          className="font-ui bg-ink text-paper px-7 py-3 rounded-full hover:bg-sketchPink disabled:opacity-30 disabled:cursor-not-allowed pencil-cursor"
        >
          Compose the note book →
        </button>
      </div>
    </section>
  );
}

function CategoryStrip({
  active,
  onPick,
}: {
  active: Category;
  onPick: (c: Category) => void;
}) {
  const reduce = useReducedMotion();
  // Render the list twice so the marquee can loop seamlessly.
  const loop = [...categories, ...categories];

  return (
    <div
      className="relative -mx-5 mb-6 overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      aria-label="Sketch categories"
    >
      <motion.div
        className="flex gap-2 w-max px-5"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reduce
            ? undefined
            : { duration: 22, repeat: Infinity, ease: "linear" }
        }
      >
        {loop.map((c, i) => {
          const isActive = c === active;
          return (
            <button
              key={`${c}-${i}`}
              type="button"
              onClick={() => onPick(c)}
              className={`relative font-ui text-sm px-4 py-2 transition-colors pencil-cursor whitespace-nowrap ${
                isActive
                  ? "text-paper bg-ink"
                  : "text-ink bg-paper hover:bg-ink/5"
              }`}
              style={{
                borderRadius: "999px",
                border: "1.5px solid #1a1a1a",
                transform: isActive ? "rotate(-1deg)" : "rotate(0)",
              }}
            >
              {c}
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
