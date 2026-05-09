import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { RoughBox } from "./RoughBox";
import { Doodle } from "./Doodle";
import { InkReveal } from "./InkReveal";
import type { Sketch } from "../data/sketches";

type Props = {
  sketch: Sketch;
  onPick: (sketch: Sketch) => void;
  index: number;
};

export function SketchCard({ sketch, onPick, index }: Props) {
  const [hover, setHover] = useState(false);
  const tilt = (index % 2 === 0 ? -1 : 1) * (1 + ((index * 7) % 3));

  const Inner = sketch.Component;
  const isHandDrawn = !!sketch.image;

  return (
    <motion.button
      type="button"
      onClick={() => onPick(sketch)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      initial={{ opacity: 0, y: 30, rotate: tilt }}
      animate={{ opacity: 1, y: 0, rotate: tilt }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.06, ease: "easeOut" }}
      whileHover={{ y: -8, rotate: tilt + (tilt > 0 ? 1.5 : -1.5), scale: 1.02 }}
      className="group relative text-left bg-paper p-3 rounded-sm pencil-cursor focus:outline-none"
      style={{
        boxShadow: hover
          ? `8px 12px 0 ${sketch.accent}33, 0 0 0 1px transparent`
          : "4px 6px 0 rgba(26,26,26,0.10)",
        transition: "box-shadow 0.3s",
      }}
      aria-label={`View ${sketch.title}`}
    >
      <RoughBox
        seed={hover ? 31 + index : 7 + index}
        roughness={1.7}
        bowing={1.6}
        strokeColor="#1a1a1a"
        strokeWidth={1.6}
      />

      {/* artwork — InkReveal wipes it in via clip-path on first scroll into view */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper">
        <InkReveal
          direction={index % 2 === 0 ? "left" : "up"}
          delay={(index % 6) * 80}
          className="h-full w-full"
        >
          {sketch.image ? (
            <Image
              src={sketch.image}
              alt={sketch.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
              className="object-contain"
            />
          ) : Inner ? (
            <Inner />
          ) : null}
        </InkReveal>

        {/* corner doodles appear on hover */}
        <div
          className="absolute -top-2 -right-2 transition-opacity duration-300"
          style={{ opacity: hover ? 1 : 0 }}
        >
          <Doodle kind="spark" color={sketch.accent} size={26} />
        </div>
        <div
          className="absolute -bottom-2 -left-2 transition-opacity duration-300"
          style={{ opacity: hover ? 1 : 0 }}
        >
          <Doodle kind="heart" color={sketch.accent} size={22} />
        </div>
      </div>

      {/* meta */}
      <div className="relative flex items-end justify-between mt-3 px-1 gap-3">
        <div className="min-w-0">
          <span
            className="inline-block font-ui text-[10px] uppercase tracking-[0.12em] px-2 py-0.5 mb-1.5 select-none"
            style={{
              background: "#FBF7F0",
              color: "#1a1a1a",
              border: "1.5px solid #1a1a1a",
              borderRadius: "999px",
              transform: `rotate(${index % 2 === 0 ? -2 : 1.5}deg)`,
            }}
            title={
              isHandDrawn
                ? "One-of-a-kind original on paper"
                : "Drawn digitally — produced from the studio"
            }
          >
            {isHandDrawn ? "✎ Hand-drawn" : "⎙ Digital-drawn"}
          </span>
          <h3 className="font-display text-2xl leading-none text-ink">
            {sketch.title}
          </h3>
          <p className="font-hand text-sm text-ink/70 mt-1">{sketch.pun}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-ui text-xs text-ink/60 uppercase tracking-wider">
            {sketch.category}
          </div>
          <div className="font-display text-2xl text-ink">${sketch.price}</div>
        </div>
      </div>
    </motion.button>
  );
}
