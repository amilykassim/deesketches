import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { RoughBox } from "./RoughBox";
import { RoughUnderline } from "./RoughUnderline";
import { Doodle } from "./Doodle";
import { Typewriter } from "./Typewriter";
import { ConfettiBurst } from "./ConfettiBurst";
import { MagneticButton } from "./MagneticButton";
import { navigate } from "../lib/router";

const SCENE_DURATIONS = [4500, 5000, 6500, 5000, 11000];

const PAGES = [
  {
    sketch: "/sketches/best-tea.jpg",
    chapter: "Chapter 1",
    title: "The Toast Treaty",
    body: "It started, as most things do, with you stealing half my toast. I let you. I'm still letting you.",
  },
  {
    sketch: "/sketches/eggstra-happy.jpg",
    chapter: "Chapter 2",
    title: "Eggstra Negotiations",
    body: "Eggs got involved. So did some unsolicited dancing. Witnesses say it was charming.",
  },
  {
    sketch: "/sketches/got-your-back.jpg",
    chapter: "Chapter 3",
    title: "The Verdict",
    body: "Sunday, rain, you. That's the whole thing. Verdict: keeping you.",
  },
];

const OCCASIONS = [
  { label: "Birthday", emoji: "🎂", color: "#F6C667" },
  { label: "Love", emoji: "💌", color: "#FF4D8D" },
  { label: "Friendship", emoji: "🫶", color: "#6FCF97" },
  { label: "Puns", emoji: "🥚", color: "#FF8A3C" },
  { label: "Custom", emoji: "✏️", color: "#4A90E2" },
];

const SKETCHES = [
  { src: "/sketches/best-tea.jpg", label: "Two cups, one stolen sip", rot: -3 },
  { src: "/sketches/eggstra-happy.jpg", label: "An egg, dramatically in love", rot: 2 },
  { src: "/sketches/got-your-back.jpg", label: "Got your back, always", rot: -1 },
];

const STATUS_LINES = [
  "Translating eye contact…",
  "Romanticizing breakfast…",
  "Words found.",
];

const SCENE_LABELS = [
  "Pick the moment",
  "Pick the sketches",
  "Write on it",
  "Sign it",
  "Open it",
];

export function LandingDemo() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: "-20% 0px -20% 0px" });

  const [scene, setScene] = useState(0);
  const [paused, setPaused] = useState(false);
  const [confetti, setConfetti] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inView || paused) return;
    const t = setTimeout(() => {
      setScene((s) => (s + 1) % SCENE_DURATIONS.length);
    }, SCENE_DURATIONS[scene]);
    return () => clearTimeout(t);
  }, [scene, paused, inView]);

  // Smooth progress tracker — drives the bar at the top and the
  // "Up next" peek. Resets each scene; freezes when paused.
  useEffect(() => {
    setProgress(0);
    if (!inView || paused) return;
    let raf = 0;
    const startedAt = performance.now();
    const total = SCENE_DURATIONS[scene];
    const tick = () => {
      const pct = Math.min(100, ((performance.now() - startedAt) / total) * 100);
      setProgress(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scene, paused, inView]);

  useEffect(() => {
    if (scene === 4) setConfetti((c) => c + 1);
  }, [scene]);

  const showUpNext =
    (scene === 0 || scene === 1) && progress > 65 && progress < 99 && !paused;
  const nextScene = (scene + 1) % SCENE_DURATIONS.length;

  return (
    <section
      ref={sectionRef}
      id="demo"
      className="relative py-28 px-3 sm:px-5 bg-paper overflow-hidden"
    >
      <Doodle
        kind="spark"
        color="#FF4D8D"
        size={36}
        drift={6}
        className="absolute top-16 left-[6%] opacity-70"
      />
      <Doodle
        kind="swirl"
        color="#4A90E2"
        size={42}
        drift={7}
        className="absolute bottom-16 right-[8%] opacity-60"
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="font-ui uppercase tracking-[0.25em] text-xs text-ink/50 mb-3">
            ~ See it happen ~
          </p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink leading-tight">
            The whole thing,{" "}
            <span className="relative inline-block">
              in 25 seconds
              <RoughUnderline color="#F6C667" seed={9} className="absolute -bottom-2 left-0" />
            </span>
            .
          </h2>
          <p className="mt-4 sm:mt-5 font-hand text-base sm:text-lg text-ink/70">
            Watch a real card get made — for the one who pretends not to like cheesy things.
          </p>
          <div className="mt-5 flex justify-center px-2">
            <span
              className="inline-flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 font-ui text-[10px] sm:text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 text-center"
              style={{
                background: "#FBF7F0",
                color: "#1a1a1a",
                border: "1.5px solid #1a1a1a",
                borderRadius: "999px",
                transform: "rotate(1deg)",
              }}
            >
              <span>⎙ Digital-drawn cards</span>
              <span className="text-ink/50 normal-case tracking-normal font-hand">
                — composed in the studio, sent in seconds
              </span>
            </span>
          </div>
        </div>

        {/* Demo frame */}
        <div
          className="relative mx-auto"
          style={{ maxWidth: 740 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused((p) => !p)}
        >
          <div
            className="relative bg-paper paper-grain overflow-hidden aspect-[11/10] sm:aspect-[6/5]"
            style={{
              transform: "rotate(-0.6deg)",
              boxShadow: "10px 12px 0 rgba(26,26,26,0.08)",
            }}
          >
            <RoughBox seed={42} strokeWidth={2.2} roughness={1.8} />

            {/* Ambient drifting doodles (behind everything) */}
            <div className="pointer-events-none absolute inset-0 z-0">
              <Doodle
                kind="spark"
                color="#FF4D8D"
                size={14}
                drift={7}
                className="absolute top-12 right-5 opacity-25"
              />
              <Doodle
                kind="dot"
                color="#4A90E2"
                size={10}
                drift={9}
                className="absolute bottom-10 left-6 opacity-30"
              />
              <Doodle
                kind="squiggle"
                color="#F6C667"
                size={14}
                drift={8}
                className="absolute top-1/3 left-3 opacity-15"
              />
              <Doodle
                kind="dot"
                color="#FF8A3C"
                size={8}
                drift={6}
                className="absolute bottom-1/3 right-3 opacity-25"
              />
            </div>

            <AnimatePresence mode="wait">
              {scene === 0 && <ScenePickMoment key="0" />}
              {scene === 1 && <ScenePickSketches key="1" />}
              {scene === 2 && <SceneGenerate key="2" />}
              {scene === 3 && <SceneSignIt key="3" />}
              {scene === 4 && <SceneOpenIt key="4" />}
            </AnimatePresence>

            <ConfettiBurst trigger={confetti} />

            {/* Scene label, top-left */}
            <div className="absolute top-3 sm:top-5 left-3 sm:left-4 z-20 flex items-baseline gap-2 max-w-[70%]">
              <span className="font-ui text-[10px] tracking-[0.2em] uppercase text-ink/45">
                {scene + 1}/5
              </span>
              <motion.span
                key={scene}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="font-hand text-xs sm:text-sm text-ink/70 truncate"
              >
                {SCENE_LABELS[scene]}
              </motion.span>
            </div>

            {/* "Up next" chip, bottom-right */}
            <AnimatePresence>
              {showUpNext && (
                <motion.div
                  key={`upnext-${scene}`}
                  initial={{ opacity: 0, x: 10, y: 4 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                  className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-20 font-ui text-[9px] sm:text-[10px] uppercase tracking-[0.18em] bg-ink text-paper px-2.5 py-1 rounded-full whitespace-nowrap"
                  style={{ transform: "rotate(-1.5deg)" }}
                >
                  Up next: {SCENE_LABELS[nextScene]} →
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress dots */}
          <div className="mt-6 flex items-center justify-center gap-3">
            {SCENE_DURATIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => setScene(i)}
                aria-label={`Jump to scene ${i + 1}`}
                className="group relative h-3 w-3"
              >
                <span
                  className={`absolute inset-0 rounded-full border-2 border-ink transition-all ${
                    i === scene ? "bg-ink scale-110" : "bg-paper group-hover:bg-ink/20"
                  }`}
                />
              </button>
            ))}
          </div>

          <p className="mt-3 text-center font-ui text-xs text-ink/50 px-4">
            {paused
              ? "paused — tap or move away to keep watching"
              : "tap to pause · tap a dot to jump"}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <MagneticButton>
            <button
              onClick={() => navigate("/compose")}
              className="font-ui px-8 py-4 bg-ink text-paper text-lg pencil-cursor"
              style={{ boxShadow: "6px 6px 0 #FF4D8D" }}
            >
              Make one →
            </button>
          </MagneticButton>
          <span className="font-hand text-ink/60 text-sm">
            (it's actually pretty fun)
          </span>
        </div>
      </div>
    </section>
  );
}

/* ========== SCENES ========== */

const sceneVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function SceneShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="absolute inset-0 p-4 pt-10 sm:p-8 sm:pt-12 md:p-10 md:pt-12 flex flex-col"
      variants={sceneVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ScenePickMoment() {
  const reduce = useReducedMotion();
  return (
    <SceneShell>
      <p className="font-ui text-[10px] sm:text-xs uppercase tracking-[0.25em] text-ink/50">
        What's the occasion?
      </p>
      <h3 className="mt-1 font-display text-2xl sm:text-4xl text-ink leading-[1.05]">
        Pick the moment.
      </h3>

      <div className="mt-3 sm:mt-5 grid grid-cols-5 gap-1.5 sm:gap-2 md:gap-3 flex-1 items-center">
        {OCCASIONS.map((o, i) => {
          const isPicked = o.label === "Love";
          return (
            <motion.div
              key={o.label}
              className="relative bg-paper aspect-square flex flex-col items-center justify-center text-center px-1"
              initial={{ opacity: 0, y: 10, rotate: i % 2 ? -2 : 2 }}
              animate={{
                opacity: isPicked ? 1 : 0.35,
                y: 0,
                rotate: i % 2 ? -1.5 : 1.5,
                scale: isPicked ? 1.06 : 1,
              }}
              transition={{
                duration: 0.4,
                delay: 0.15 + i * 0.06,
                scale: { delay: 1.4, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] },
                opacity: { delay: 1.4, duration: 0.4 },
              }}
              style={{ boxShadow: isPicked ? `5px 6px 0 ${o.color}` : "3px 4px 0 rgba(26,26,26,0.1)" }}
            >
              <RoughBox seed={50 + i} strokeWidth={1.6} roughness={1.6} />
              <span className="text-xl sm:text-2xl md:text-3xl leading-none">{o.emoji}</span>
              <span className="mt-1 font-ui text-[8px] sm:text-[10px] md:text-xs text-ink leading-tight">
                {o.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Pencil cursor that drifts to Birthday */}
      {!reduce && (
        <motion.div
          className="absolute pointer-events-none text-2xl"
          initial={{ left: "85%", top: "85%", opacity: 0 }}
          animate={{ left: "36%", top: "62%", opacity: [0, 1, 1, 1] }}
          transition={{ duration: 1.3, ease: [0.2, 0.8, 0.2, 1] }}
        >
          ✏️
        </motion.div>
      )}

      <motion.p
        className="mt-3 sm:mt-4 pr-24 sm:pr-0 font-hand text-sm sm:text-base md:text-lg text-ink/70 leading-snug"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.4 }}
      >
        For: <span className="text-ink">You</span>{" "}
        <span className="text-ink/50">(who pretends not to like cheesy things)</span>
      </motion.p>
    </SceneShell>
  );
}

function ScenePickSketches() {
  return (
    <SceneShell>
      <p className="font-ui text-[10px] sm:text-xs uppercase tracking-[0.25em] text-ink/50">
        Pick 3 sketches
      </p>
      <h3 className="mt-1 font-display text-2xl sm:text-4xl text-ink leading-[1.05]">
        Build the story.
      </h3>

      <div className="mt-3 sm:mt-5 flex-1 flex items-center justify-center gap-2 sm:gap-3 md:gap-5">
        {SKETCHES.map((s, i) => (
          <motion.div
            key={s.src}
            className="flex flex-col items-center"
            style={{ width: "30%" }}
            initial={{ opacity: 0, x: -120 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              damping: 14,
              stiffness: 180,
              mass: 0.7,
              delay: 0.2 + i * 0.35,
            }}
          >
            <div
              className="relative bg-paper p-2 w-full"
              style={{
                aspectRatio: "3/4",
                transform: `rotate(${s.rot}deg)`,
                boxShadow: "4px 5px 0 rgba(26,26,26,0.12)",
              }}
            >
              <RoughBox seed={70 + i} strokeWidth={1.4} roughness={1.4} />
              <div className="relative h-full overflow-hidden bg-[#F4EFE4]">
                <img
                  src={s.src}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <span className="absolute -top-2 -left-2 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-ink text-paper font-ui text-[10px] sm:text-xs flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
            </div>
            <motion.p
              className="mt-2 w-full text-center font-hand text-[10px] sm:text-xs md:text-sm text-ink/80 leading-tight"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.35, duration: 0.3 }}
            >
              {s.label}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </SceneShell>
  );
}

function SceneGenerate() {
  const [statusIdx, setStatusIdx] = useState(0);
  const [showStory, setShowStory] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setStatusIdx(1), 900));
    timers.push(setTimeout(() => setStatusIdx(2), 1700));
    timers.push(setTimeout(() => setShowStory(true), 2400));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <SceneShell>
      <p className="font-ui text-[10px] sm:text-xs uppercase tracking-[0.25em] text-ink/50">
        Spinning the yarn
      </p>
      <h3 className="mt-1 font-display text-2xl sm:text-4xl text-ink leading-[1.05]">
        Write a heartfelt note.
      </h3>

      <div className="mt-3 sm:mt-5 flex-1 flex flex-col items-center justify-center min-h-0">
        {!showStory ? (
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="text-2xl sm:text-3xl"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
            >
              ✦
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.p
                key={statusIdx}
                className="font-hand text-base sm:text-xl md:text-2xl text-ink/80"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
              >
                {STATUS_LINES[statusIdx]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            className="relative w-full max-w-md bg-paper p-3 sm:p-5 md:p-6"
            initial={{ opacity: 0, scale: 0.94, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, rotate: -0.6 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ boxShadow: "5px 6px 0 #FF4D8D55" }}
          >
            <RoughBox seed={88} strokeWidth={1.6} roughness={1.5} />
            <div className="relative">
              <p className="font-ui text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-ink/40">
                Chapter 1
              </p>
              <h4 className="mt-1 font-display text-xl sm:text-2xl md:text-3xl text-ink leading-tight">
                <Typewriter text="The Toast Treaty" speed={70} />
              </h4>
              <p className="mt-2 sm:mt-3 font-hand text-sm sm:text-base md:text-lg text-ink/75 leading-snug sm:leading-relaxed">
                <Typewriter
                  text="It started, as most things do, with you stealing half my toast. I let you."
                  speed={45}
                  delay={1100}
                />
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </SceneShell>
  );
}

function SceneSignIt() {
  const [fromDone, setFromDone] = useState(false);
  const [toDone, setToDone] = useState(false);

  return (
    <SceneShell>
      <p className="font-ui text-[10px] sm:text-xs uppercase tracking-[0.25em] text-ink/50">
        Almost there
      </p>
      <h3 className="mt-1 font-display text-2xl sm:text-4xl text-ink leading-[1.05]">
        Sign it.
      </h3>

      <div className="mt-3 sm:mt-5 flex-1 flex flex-col justify-center gap-3 sm:gap-6 max-w-md mx-auto w-full">
        <Field
          label="From"
          text="Yours, mostly"
          delay={300}
          onDone={() => setFromDone(true)}
          showHeart={fromDone}
        />
        <Field
          label="To"
          text="You (still my favorite trouble)"
          delay={1900}
          onDone={() => setToDone(true)}
          showHeart={toDone}
        />
      </div>
    </SceneShell>
  );
}

function Field({
  label,
  text,
  delay,
  onDone,
  showHeart,
}: {
  label: string;
  text: string;
  delay: number;
  onDone: () => void;
  showHeart: boolean;
}) {
  return (
    <div className="relative">
      <label className="font-ui text-[9px] sm:text-xs uppercase tracking-[0.2em] text-ink/50">
        {label}
      </label>
      <div
        className="relative mt-0.5 sm:mt-1 bg-paper px-3 py-1.5 sm:px-4 sm:py-3"
        style={{ boxShadow: "3px 4px 0 rgba(26,26,26,0.1)" }}
      >
        <RoughBox seed={label === "From" ? 100 : 110} strokeWidth={1.4} roughness={1.4} />
        <p className="relative font-hand text-sm sm:text-xl text-ink min-h-[1.4em] sm:min-h-[1.6em] leading-tight">
          <Typewriter text={text} speed={70} delay={delay} onDone={onDone} />
        </p>
        <AnimatePresence>
          {showHeart && (
            <motion.span
              className="absolute -top-3 right-2 z-10"
              initial={{ opacity: 0, scale: 0.5, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", damping: 12, stiffness: 240 }}
            >
              <Doodle kind="heart" color="#FF4D8D" size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SceneOpenIt() {
  const reduce = useReducedMotion();
  const [bookOpen, setBookOpen] = useState(false);
  const [pageIdx, setPageIdx] = useState(0);
  const [showCaption, setShowCaption] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setBookOpen(true), 900));
    timers.push(setTimeout(() => setPageIdx(1), 3300));
    timers.push(setTimeout(() => setPageIdx(2), 5800));
    timers.push(setTimeout(() => setShowCaption(true), 8200));
    return () => timers.forEach(clearTimeout);
  }, []);

  const page = PAGES[pageIdx];
  const flipDuration = reduce ? 0.3 : 0.85;

  return (
    <SceneShell>
      <p className="font-ui text-[10px] sm:text-xs uppercase tracking-[0.25em] text-ink/50">
        Delivered
      </p>
      <h3 className="mt-1 font-display text-2xl sm:text-4xl text-ink leading-[1.05]">
        They open it.
      </h3>

      <div className="relative mt-2 sm:mt-4 flex-1 flex items-center justify-center min-h-0">
        {/* Envelope */}
        <motion.div
          className="absolute z-10 w-28 sm:w-44"
          initial={{ x: -180, opacity: 0, rotate: -8 }}
          animate={{ x: bookOpen ? -260 : 0, opacity: bookOpen ? 0 : 1, rotate: -4 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ aspectRatio: "3/2" }}
        >
          <div className="relative w-full h-full bg-paper" style={{ boxShadow: "4px 5px 0 rgba(26,26,26,0.15)" }}>
            <RoughBox seed={130} strokeWidth={1.6} />
            <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full" aria-hidden>
              <path
                d="M4 8 L50 38 L96 8"
                stroke="#1a1a1a"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            <Doodle
              kind="heart"
              color="#FF4D8D"
              size={20}
              className="absolute top-2 right-2"
            />
          </div>
        </motion.div>

        {/* Book */}
        <AnimatePresence>
          {bookOpen && (
            <motion.div
              className="relative flex w-[72%] sm:w-[88%]"
              initial={{ scale: 0.7, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 16, stiffness: 160 }}
              style={{
                maxWidth: 480,
                aspectRatio: "16 / 10",
                maxHeight: "100%",
                perspective: 1400,
              }}
            >
              {/* Left page (sketch) — cross-fades on flip */}
              <div
                className="relative w-1/2 bg-paper overflow-hidden"
                style={{ boxShadow: "inset -8px 0 14px -10px rgba(0,0,0,0.35)" }}
              >
                <RoughBox seed={140} strokeWidth={1.4} />
                <div className="relative h-full p-3">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={page.sketch}
                      src={page.sketch}
                      alt=""
                      className="h-full w-full object-cover"
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, delay: 0.25 }}
                    />
                  </AnimatePresence>
                </div>
              </div>

              {/* Right page (text) — flips on chapter change */}
              <div
                className="relative w-1/2"
                style={{ transformStyle: "preserve-3d" }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={pageIdx}
                    className="absolute inset-0 bg-paper p-2 sm:p-4 md:p-5"
                    initial={{ rotateY: -110, x: -8, opacity: 0 }}
                    animate={{ rotateY: 0, x: 0, opacity: 1 }}
                    exit={{ rotateY: 95, x: 12, opacity: 0 }}
                    transition={{ duration: flipDuration, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                      transformOrigin: "left center",
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                      boxShadow: "inset 8px 0 14px -10px rgba(0,0,0,0.35)",
                    }}
                  >
                    <RoughBox seed={141 + pageIdx} strokeWidth={1.4} />
                    <div className="relative">
                      <p className="font-ui text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-ink/40">
                        {page.chapter}
                      </p>
                      <h4 className="mt-0.5 font-display text-sm sm:text-lg md:text-xl text-ink leading-tight">
                        {page.title}
                      </h4>
                      <p className="mt-1 sm:mt-2 font-hand text-[10px] sm:text-xs md:text-sm text-ink/80 leading-snug sm:leading-relaxed">
                        {page.body}
                      </p>
                      <p className="mt-1.5 sm:mt-3 font-hand text-[9px] sm:text-[11px] md:text-xs text-ink/50 italic">
                        — Yours, mostly
                      </p>
                    </div>
                    {/* Page corner curl hint */}
                    <svg
                      className="absolute bottom-1 right-1 opacity-40"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      aria-hidden
                    >
                      <path
                        d="M20 2 L20 20 L2 20 Q 14 18, 18 4 Z"
                        fill="rgba(26,26,26,0.08)"
                        stroke="#1a1a1a"
                        strokeWidth="0.8"
                      />
                    </svg>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Page count + spine */}
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {PAGES.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full transition-all ${
                      i === pageIdx ? "bg-ink w-4" : "bg-ink/30"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.p
        className="text-center font-hand text-sm sm:text-base md:text-lg text-ink/70 mt-3 sm:mt-4 leading-snug"
        initial={{ opacity: 0 }}
        animate={{ opacity: showCaption ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        …and they read it three times{" "}
        <span className="text-ink/50">(in a row)</span>.
      </motion.p>
    </SceneShell>
  );
}
