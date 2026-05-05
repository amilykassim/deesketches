import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { findArc } from "../../data/stories";
import { sketches } from "../../data/sketches";
import { Typewriter } from "../../components/Typewriter";
import { Doodle } from "../../components/Doodle";

const STATUS_MESSAGES = [
  "Consulting the muses…",
  "Weaving the words…",
  "Threading the chapters…",
  "Sharpening the pencil…",
  "Inking the final flourish…",
];

type Props = {
  arcId: string;
  cardIds: string[];
  onDone: () => void;
};

export function GenerateStep({ arcId, cardIds, onDone }: Props) {
  const arc = findArc(arcId);
  const [phase, setPhase] = useState<"loading" | "preview">("loading");
  const [statusIdx, setStatusIdx] = useState(0);
  const [revealIdx, setRevealIdx] = useState(0);

  // Cycle status messages while loading
  useEffect(() => {
    if (phase !== "loading") return;
    const t = setInterval(
      () => setStatusIdx((i) => (i + 1) % STATUS_MESSAGES.length),
      1100
    );
    return () => clearInterval(t);
  }, [phase]);

  // Loading delay before reveal
  useEffect(() => {
    const t = setTimeout(() => setPhase("preview"), 3200);
    return () => clearTimeout(t);
  }, []);

  if (!arc) return null;

  const N = cardIds.length;
  const chapters = arc.chapters.slice(0, N);

  const allRevealed = revealIdx >= chapters.length;

  return (
    <section>
      <AnimatePresence mode="wait">
        {phase === "loading" && (
          <motion.div
            key="loading"
            className="text-center py-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex justify-center gap-3 mb-8">
              <Doodle kind="spark" color="#FF4D8D" size={28} drift={3} />
              <Doodle kind="star" color="#F6C667" size={28} drift={4} />
              <Doodle kind="swirl" color="#4A90E2" size={28} drift={3.5} />
            </div>
            <h1 className="font-display text-4xl mb-4">
              The story is forming…
            </h1>
            <AnimatePresence mode="wait">
              <motion.p
                key={statusIdx}
                className="font-hand text-lg text-ink/65"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                {STATUS_MESSAGES[statusIdx]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}

        {phase === "preview" && (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="font-ui text-xs uppercase tracking-wider text-ink/55 text-center mb-2">
              {arc.title}
            </div>
            <h1 className="font-display text-4xl text-center mb-8">
              {N === 1 ? "Your vignette" : `${N} chapters, just for them`}
            </h1>

            <div className="space-y-8 max-w-2xl mx-auto">
              {chapters.map((ch, i) => {
                if (i > revealIdx) return null;
                const sketchId = cardIds[i];
                const sk = sketches.find((s) => s.id === sketchId);
                return (
                  <motion.div
                    key={ch.n}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-paper p-6 relative"
                    style={{
                      boxShadow: "4px 6px 0 rgba(26,26,26,0.10)",
                      transform: `rotate(${i % 2 === 0 ? -0.6 : 0.6}deg)`,
                    }}
                  >
                    <div className="flex gap-4 items-start">
                      {sk?.Component && (
                        <div className="w-24 shrink-0 aspect-[4/3] overflow-hidden">
                          <sk.Component />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-ui text-xs uppercase tracking-wider text-ink/55 mb-1">
                          Chapter {ch.n}
                        </div>
                        <h3 className="font-display text-2xl mb-2">
                          {i === revealIdx ? (
                            <Typewriter
                              text={ch.title}
                              speed={70}
                              onDone={() => {
                                /* title done; body follows automatically */
                              }}
                            />
                          ) : (
                            ch.title
                          )}
                        </h3>
                        <p className="font-hand text-ink/80 leading-relaxed">
                          {i === revealIdx ? (
                            <Typewriter
                              text={ch.body}
                              speed={45}
                              delay={Math.min(ch.title.length * 70, 1400)}
                              onDone={() => setRevealIdx(i + 1)}
                            />
                          ) : (
                            ch.body
                          )}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {allRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center mt-10"
              >
                <button
                  type="button"
                  onClick={onDone}
                  className="font-ui bg-ink text-paper px-7 py-3 rounded-full hover:bg-sketchPink pencil-cursor transition-colors"
                >
                  Add the names →
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
