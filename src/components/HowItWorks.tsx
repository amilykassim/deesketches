import { motion } from "framer-motion";
import { RoughBox } from "./RoughBox";
import { Doodle } from "./Doodle";

const steps = [
  {
    n: "01",
    title: "pick or describe",
    body: "browse the gallery — or tell me a story, a name, an inside joke.",
    accent: "#FF4D8D",
  },
  {
    n: "02",
    title: "i draw it by hand",
    body: "no printers, no shortcuts. just markers, a wobbly desk, and tea.",
    accent: "#F6C667",
  },
  {
    n: "03",
    title: "ships in a doodled envelope",
    body: "tracked worldwide. arrives in 5–10 days, hand-decorated end-to-end.",
    accent: "#4A90E2",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-28 px-5 bg-[#F4EFE4]">
      <Doodle kind="squiggle" color="#FF8A3C" size={48} drift={6} className="absolute top-10 left-[8%]" />
      <Doodle kind="star" color="#FF4D8D" size={28} drift={5} className="absolute bottom-12 right-[10%]" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-ui uppercase tracking-[0.25em] text-xs text-ink/50 mb-3">
            ~ how it works ~
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-ink leading-tight">
            three steps. <span className="text-sketchPink">no robots.</span>
          </h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-8 md:gap-4">
          {/* hand-drawn arrows between steps (desktop only) */}
          <svg
            viewBox="0 0 1000 60"
            preserveAspectRatio="none"
            className="hidden md:block absolute top-[60px] left-0 w-full h-12 pointer-events-none"
            aria-hidden="true"
          >
            <path
              d="M260 30 Q 320 10, 360 30 Q 400 50, 440 30"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
            <path d="M440 30 l-10 -5 l4 5 l-4 5 z" fill="#1a1a1a" />
            <path
              d="M580 30 Q 640 10, 680 30 Q 720 50, 760 30"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
            <path d="M760 30 l-10 -5 l4 5 l-4 5 z" fill="#1a1a1a" />
          </svg>

          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 30, rotate: i % 2 === 0 ? -2 : 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
              className="relative bg-paper p-7"
              style={{ boxShadow: `8px 10px 0 ${step.accent}55` }}
            >
              <RoughBox seed={20 + i} strokeWidth={2} roughness={1.7} />
              <div className="relative flex items-baseline gap-3">
                <span className="font-display text-5xl text-ink/15 leading-none">
                  {step.n}
                </span>
                <h3 className="font-display text-3xl text-ink leading-tight">
                  {step.title}
                </h3>
              </div>
              <p className="relative mt-3 font-hand text-lg text-ink/75 leading-relaxed">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
