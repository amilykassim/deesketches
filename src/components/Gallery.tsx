import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { sketches, categories, type Sketch, type Category } from "../data/sketches";
import { SketchCard } from "./SketchCard";

type Props = {
  onPick: (sketch: Sketch) => void;
};

const ALL = "All" as const;
type Filter = typeof ALL | Category;

export function Gallery({ onPick }: Props) {
  const [filter, setFilter] = useState<Filter>(ALL);

  const items = useMemo(
    () => (filter === ALL ? sketches : sketches.filter((s) => s.category === filter)),
    [filter]
  );

  return (
    <section id="gallery" className="relative py-24 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-ui uppercase tracking-[0.25em] text-xs text-ink/50 mb-3">
            ~ the gallery ~
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-5xl md:text-6xl text-ink mb-4"
          >
            Pick your <span className="text-sketchPink">favourite feeling</span>.
          </motion.h2>
          <p className="font-hand text-lg text-ink/70 max-w-xl mx-auto">
            Every sketch is one-of-a-kind. order the original or a hand-finished print.
          </p>
        </div>

        {/* category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {[ALL, ...categories].map((c) => {
            const active = c === filter;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c as Filter)}
                className={`relative font-ui text-sm px-4 py-2 transition-colors pencil-cursor ${
                  active ? "text-paper bg-ink" : "text-ink bg-paper hover:bg-ink/5"
                }`}
                style={{
                  borderRadius: "999px",
                  border: "1.5px solid #1a1a1a",
                  transform: active ? "rotate(-1deg)" : "rotate(0)",
                }}
              >
                {c.toLowerCase()}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {items.map((s, i) => (
            <SketchCard key={s.id} sketch={s} index={i} onPick={onPick} />
          ))}
        </div>
      </div>
    </section>
  );
}
