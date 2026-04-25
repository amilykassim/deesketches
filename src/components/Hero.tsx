import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Doodle } from "./Doodle";
import { RoughBox } from "./RoughBox";
import { RoughUnderline } from "./RoughUnderline";
import { BestTea } from "../sketches/BestTea";

type Props = {
  onBrowse: () => void;
  onCommission: () => void;
};

const headline = ["Tiny", "sketches,", "big", "feelings."];

export function Hero({ onBrowse, onCommission }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yArt = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const rotArt = useTransform(scrollYProgress, [0, 1], [-4, 6]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate min-h-[100svh] flex items-center pt-24 pb-12 px-5"
    >
      {/* floating doodles */}
      <Doodle kind="heart" color="#FF4D8D" size={28} drift={6} className="absolute top-32 left-[8%] z-10" rotate={-10} />
      <Doodle kind="star"  color="#F6C667" size={32} drift={7} className="absolute top-44 right-[12%] z-10" rotate={15} />
      <Doodle kind="swirl" color="#4A90E2" size={36} drift={8} className="absolute bottom-32 left-[15%] z-10" rotate={20} />
      <Doodle kind="squiggle" color="#FF8A3C" size={42} drift={5} className="absolute top-1/2 right-[6%] z-10" rotate={-8} />
      <Doodle kind="spark" color="#FF4D8D" size={26} drift={6.5} className="absolute bottom-20 right-[28%] z-10" rotate={0} />
      <Doodle kind="dot" color="#1a1a1a" size={14} drift={4} className="absolute top-36 left-[42%] z-10" />
      <Doodle kind="tea" color="#1a1a1a" size={32} drift={9} className="absolute top-1/3 left-[3%] z-10" rotate={-15} />
      <Doodle kind="egg" color="#1a1a1a" size={30} drift={10} className="absolute bottom-40 right-[3%] z-10" rotate={12} />

      <div className="relative z-20 max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 items-center w-full">
        {/* Headline + CTAs */}
        <div className="lg:col-span-7 text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-ui text-ink/60 tracking-[0.2em] uppercase text-xs mb-5"
          >
            * hand-drawn · made one at a time *
          </motion.p>

          <h1 className="font-display text-ink leading-[0.92] text-[clamp(3.2rem,9vw,7.5rem)] mb-4">
            {headline.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30, rotate: i % 2 === 0 ? -3 : 3 }}
                animate={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
                transition={{
                  duration: 0.55,
                  delay: 0.2 + i * 0.18,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
                className={`inline-block mr-3 ${
                  word === "feelings."
                    ? "text-sketchPink"
                    : word === "sketches,"
                    ? "text-ink"
                    : ""
                }`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.05 }}
            className="relative inline-block mb-8"
          >
            <p className="font-hand text-xl md:text-2xl text-ink/80 max-w-xl">
              hand-drawn cards & doodles for the moments that deserve a{" "}
              <span className="ink-underline font-semibold">real</span> hello.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.25 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start"
          >
            <button
              type="button"
              onClick={onBrowse}
              className="relative px-7 py-3.5 font-ui text-lg text-ink bg-sketchYellow pencil-cursor"
            >
              <RoughBox seed={11} strokeColor="#1a1a1a" strokeWidth={2} roughness={2} />
              <span className="relative">browse the gallery →</span>
            </button>
            <button
              type="button"
              onClick={onCommission}
              className="relative px-7 py-3.5 font-ui text-lg text-paper bg-ink pencil-cursor"
            >
              <RoughBox seed={4} strokeColor="#FF4D8D" strokeWidth={2} roughness={2} />
              <span className="relative">commission a sketch</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.45 }}
            className="mt-8 flex items-center gap-3 justify-center lg:justify-start"
          >
            <div className="flex -space-x-2">
              {["#FF4D8D", "#FF8A3C", "#4A90E2", "#F6C667"].map((c, i) => (
                <span
                  key={i}
                  className="inline-block w-8 h-8 rounded-full border-2 border-paper"
                  style={{ background: c }}
                />
              ))}
            </div>
            <span className="font-hand text-sm text-ink/70">
              loved by 800+ humans worldwide
            </span>
          </motion.div>
        </div>

        {/* Featured artwork */}
        <motion.div
          style={{ y: yArt, rotate: rotArt }}
          className="lg:col-span-5 relative"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="relative mx-auto max-w-md p-3 bg-paper"
            style={{ boxShadow: "12px 14px 0 rgba(26,26,26,0.12)" }}
          >
            <RoughBox seed={9} strokeColor="#1a1a1a" strokeWidth={2} roughness={1.6} />
            <div className="relative aspect-[4/3]">
              <BestTea />
            </div>
            <div className="relative mt-2 px-2 flex justify-between items-baseline">
              <span className="font-display text-2xl">Best-tea</span>
              <span className="font-ui text-sm text-ink/60">popular pick</span>
            </div>
          </motion.div>

          <Doodle kind="heart" color="#FF4D8D" size={24} drift={5} className="absolute -top-4 -right-4" rotate={20} />
          <Doodle kind="star"  color="#F6C667" size={22} drift={6} className="absolute -bottom-6 -left-4" rotate={-12} />
        </motion.div>
      </div>

      {/* scroll indicator */}
      <motion.a
        href="#story"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { duration: 1, delay: 1.6 },
          y: { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 1.6 },
        }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-ui text-xs text-ink/60 flex flex-col items-center gap-1"
        aria-label="Scroll down"
      >
        scroll
        <svg width="16" height="22" viewBox="0 0 16 22">
          <path d="M8 2 Q 6 11, 8 18" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 14 Q 8 22, 13 14" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </motion.a>
    </section>
  );
}
