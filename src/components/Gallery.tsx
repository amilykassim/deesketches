import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { sketches, categories, type Sketch, type Category } from "../data/sketches";
import { SketchCard } from "./SketchCard";

type Props = {
  onPick: (sketch: Sketch) => void;
};

const ALL = "All" as const;
type Filter = typeof ALL | Category;

const PAGE_SIZE = 9;

export function Gallery({ onPick }: Props) {
  const [filter, setFilter] = useState<Filter>(ALL);
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  const items = useMemo(
    () => (filter === ALL ? sketches : sketches.filter((s) => s.category === filter)),
    [filter]
  );

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const goTo = (n: number) => {
    setPage(n);
    // Wait two frames so React commits the new page and layout settles
    // before scrolling — otherwise iOS Safari's smooth scroll lands in
    // the wrong place when the new page is shorter than the previous.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = gridRef.current;
        if (!el) return;
        const navOffset = 80;
        const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      });
    });
  };

  return (
    <section id="gallery" className="relative py-24 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-ui uppercase tracking-[0.25em] text-xs text-ink/50 mb-3">
            ~ The gallery ~
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
            Every sketch is one-of-a-kind. Order a digital or a hand drawn touch.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-ui text-xs text-ink/65">
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-[0.12em]"
                style={{
                  background: "#FBF7F0",
                  color: "#1a1a1a",
                  border: "1.5px solid #1a1a1a",
                  borderRadius: "999px",
                }}
              >
                ✎ Hand-drawn
              </span>
              <span>= drawn in the studio, hand-finished</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-[0.12em]"
                style={{
                  background: "#FBF7F0",
                  color: "#1a1a1a",
                  border: "1.5px solid #1a1a1a",
                  borderRadius: "999px",
                }}
              >
                ⎙ Digital-drawn
              </span>
              <span>= drawn in Andiko studio by the artist</span>
            </span>
          </div>
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
                {c}
              </button>
            );
          })}
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 scroll-mt-24"
        >
          {visible.map((s, i) => (
            <SketchCard key={s.id} sketch={s} index={i} onPick={onPick} />
          ))}
        </div>

        {pageCount > 1 && (
          <nav
            className="mt-16 flex flex-col items-center gap-3"
            aria-label="Gallery pagination"
          >
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <PageButton
                disabled={safePage === 1}
                onClick={() => goTo(safePage - 1)}
                ariaLabel="Previous page"
              >
                ← prev
              </PageButton>

              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => {
                const active = n === safePage;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => goTo(n)}
                    aria-label={`Page ${n}`}
                    aria-current={active ? "page" : undefined}
                    className={`relative font-ui text-sm w-10 h-10 transition-colors pencil-cursor ${
                      active ? "text-paper bg-ink" : "text-ink bg-paper hover:bg-ink/5"
                    }`}
                    style={{
                      borderRadius: "999px",
                      border: "1.5px solid #1a1a1a",
                      transform: active ? `rotate(${n % 2 === 0 ? -2 : 2}deg)` : "rotate(0)",
                    }}
                  >
                    {n}
                  </button>
                );
              })}

              <PageButton
                disabled={safePage === pageCount}
                onClick={() => goTo(safePage + 1)}
                ariaLabel="Next page"
              >
                next →
              </PageButton>
            </div>
            <p className="font-hand text-sm text-ink/55">
              Page {safePage} of {pageCount} · {items.length} sketches
            </p>
          </nav>
        )}
      </div>
    </section>
  );
}

function PageButton({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`font-ui text-sm px-4 py-2 transition-colors pencil-cursor ${
        disabled
          ? "text-ink/30 bg-paper cursor-not-allowed"
          : "text-ink bg-paper hover:bg-ink/5"
      }`}
      style={{
        borderRadius: "999px",
        border: `1.5px solid ${disabled ? "rgba(26,26,26,0.25)" : "#1a1a1a"}`,
      }}
    >
      {children}
    </button>
  );
}
