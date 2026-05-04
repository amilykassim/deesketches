import { motion } from "framer-motion";
import { Doodle } from "./Doodle";
import { RoughBox } from "./RoughBox";

export function Story() {
  return (
    <section id="story" className="relative py-28 px-5 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30, rotate: -3 }}
          whileInView={{ opacity: 1, x: 0, rotate: -2 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:col-span-5 relative"
        >
          <div className="relative bg-paper p-4 max-w-sm mx-auto" style={{ boxShadow: "10px 14px 0 rgba(26,26,26,0.10)" }}>
            <RoughBox seed={17} roughness={1.7} strokeWidth={2} />
            <svg viewBox="0 0 240 240" className="block w-full">
              <rect width="240" height="240" fill="#FFF5D7" />
              <g transform="translate(120,120)">
                <path
                  d="M-58 -35 Q -75 5, -55 50 Q -25 85, 30 75 Q 80 60, 70 0 Q 55 -55, 0 -65 Q -45 -65, -58 -35 Z"
                  fill="#FBF7F0"
                  stroke="#1a1a1a"
                  strokeWidth="3"
                />
                <circle cx="-15" cy="-10" r="3" fill="#1a1a1a" />
                <circle cx="20" cy="-10" r="3" fill="#1a1a1a" />
                <path d="M-12 12 q15 12 32 0" fill="none" stroke="#1a1a1a" strokeWidth="2.4" />
                <path d="M-30 -34 q-2 -10 6 -14" fill="none" stroke="#1a1a1a" strokeWidth="2" />
                <path d="M30 -34 q2 -10 -6 -14" fill="none" stroke="#1a1a1a" strokeWidth="2" />
                {/* hand holding a pen */}
                <path d="M48 60 l30 22 l-6 6 l-30 -20 z" fill="#FBF7F0" stroke="#1a1a1a" strokeWidth="2" />
                <line x1="78" y1="82" x2="92" y2="96" stroke="#1a1a1a" strokeWidth="3" />
              </g>
            </svg>
          </div>
          <Doodle kind="spark" color="#FF4D8D" size={26} drift={5} className="absolute -top-4 -right-2" />
          <Doodle kind="heart" color="#FF4D8D" size={20} drift={6} className="absolute -bottom-2 -left-3" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="md:col-span-7"
        >
          <p className="font-ui uppercase tracking-[0.25em] text-xs text-ink/50 mb-4">
            ~ the story ~
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-ink leading-tight mb-6">
            I started drawing for{" "}
            <span className="text-sketchPink">my husband's</span> birthday.
          </h2>
          <p className="font-hand text-xl text-ink/85 leading-relaxed mb-4">
            Then her sister wanted one. Then her sister's coworker. Then a stranger
            on the internet.
          </p>
          <p className="font-hand text-xl text-ink/85 leading-relaxed">
            Now I draw <span className="ink-underline">tiny silly sketches</span>{" "}
            full-time — the kind of cards that feel like a hug, not a transaction.
            Every piece is hand-drawn on cotton paper, signed, and shipped in a
            doodled envelope.
          </p>

          <div className="mt-8 flex flex-wrap gap-6 font-ui text-ink/70">
            <div>
              <div className="font-display text-4xl text-ink">800+</div>
              <div className="text-xs uppercase tracking-wider">Cards mailed</div>
            </div>
            <div>
              <div className="font-display text-4xl text-ink">42</div>
              <div className="text-xs uppercase tracking-wider">Countries</div>
            </div>
            <div>
              <div className="font-display text-4xl text-ink">∞</div>
              <div className="text-xs uppercase tracking-wider">Cups of tea</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
