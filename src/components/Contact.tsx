import { motion } from "framer-motion";
import { RoughBox } from "./RoughBox";
import { Doodle } from "./Doodle";

const INSTAGRAM_URL = "https://www.instagram.com/andiko_studio/";

export function Contact() {
  return (
    <section id="contact" className="relative py-28 px-5 bg-paper">
      <Doodle kind="heart" color="#FF4D8D" size={28} drift={5} className="absolute top-12 left-[8%]" rotate={-10} />
      <Doodle kind="swirl" color="#4A90E2" size={36} drift={6} className="absolute bottom-16 right-[12%]" />

      <div className="max-w-3xl mx-auto text-center mb-12">
        <p className="font-ui uppercase tracking-[0.25em] text-xs text-ink/50 mb-3">
          ~ Got an idea? Let's chat ~
        </p>
        <h2 className="font-display text-5xl md:text-6xl text-ink leading-tight mb-4">
          Tell me <span className="text-sketchPink">about it</span>.
        </h2>
        <p className="font-hand text-lg text-ink/75">
          A name, a moment, a pun you can't stop thinking about. Slide into the
          DMs and I'll sketch back within 1 hour.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col items-center gap-4"
      >
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative px-8 py-4 font-ui text-lg text-paper bg-ink pencil-cursor transition-shadow hover:shadow-[6px_8px_0_rgba(255,77,141,0.35)]"
        >
          <RoughBox seed={91} strokeColor="#FF4D8D" strokeWidth={2} roughness={2} />
          <span className="relative inline-flex items-center gap-2.5">
            Talk to us on IG
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </span>
        </a>
        <p className="font-hand text-sm text-ink/45">@andiko_studio</p>
      </motion.div>
    </section>
  );
}
