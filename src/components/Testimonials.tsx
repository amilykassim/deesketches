import { motion } from "framer-motion";
import { RoughBox } from "./RoughBox";

const quotes = [
  {
    text: "i cried. like, full crying. my best friend made hers her phone wallpaper.",
    name: "priya",
    where: "london",
    color: "#FF4D8D",
  },
  {
    text: "got the egg-stra one for my partner. now we say it instead of i love you. send help.",
    name: "marco",
    where: "milan",
    color: "#4A90E2",
  },
  {
    text: "actual hand-drawn? in 2025? i didn't know i needed this until it arrived.",
    name: "sade",
    where: "lagos",
    color: "#F6C667",
  },
];

export function Testimonials() {
  return (
    <section className="py-28 px-5 max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <p className="font-ui uppercase tracking-[0.25em] text-xs text-ink/50 mb-3">
          ~ kind words ~
        </p>
        <h2 className="font-display text-5xl md:text-6xl text-ink">
          People say <span className="text-sketchPink">nice things</span>.
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {quotes.map((q, i) => (
          <motion.figure
            key={i}
            initial={{ opacity: 0, y: 30, rotate: i === 1 ? 2 : -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: i === 1 ? 1.5 : -1.5 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className="relative bg-paper p-7"
            style={{ boxShadow: `7px 9px 0 ${q.color}33` }}
          >
            <RoughBox seed={50 + i} strokeWidth={2} roughness={1.6} />
            <svg
              viewBox="0 0 60 30"
              className="relative -mt-4 mb-2 w-12 h-6"
              aria-hidden="true"
            >
              <path
                d="M5 5 Q 12 2, 18 5 Q 22 8, 18 12 Q 14 14, 8 16"
                fill="none"
                stroke={q.color}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M30 5 Q 37 2, 43 5 Q 47 8, 43 12 Q 39 14, 33 16"
                fill="none"
                stroke={q.color}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <blockquote className="relative font-hand text-xl text-ink/90 leading-relaxed">
              {q.text}
            </blockquote>
            <figcaption className="relative mt-5 font-display text-2xl text-ink">
              — {q.name}
              <span className="font-ui text-xs text-ink/50 ml-2 uppercase tracking-wider">
                {q.where}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
