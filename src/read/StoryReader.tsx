import React, { forwardRef, useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import type { Sketch } from "../data/sketches";
import type { Chapter } from "../data/stories";
import { RoughBox } from "../components/RoughBox";
import { Doodle } from "../components/Doodle";

type Pair = { sketch: Sketch | undefined; chapter: Chapter | undefined };

type Props = {
  title: string;
  sender: string;
  recipient: string;
  secretKey: string;
  pairs: Pair[];
};

export function StoryReader({
  title,
  sender,
  recipient,
  secretKey,
  pairs,
}: Props) {
  const bookRef = useRef<any>(null);
  const [page, setPage] = useState(0);

  const flip = () => bookRef.current?.pageFlip?.();

  const physicalPages: React.ReactNode[] = [
    <Cover
      key="cover"
      title={title}
      sender={sender}
      recipient={recipient}
      secretKey={secretKey}
    />,
    ...pairs.flatMap((pair, i) => [
      <LeftSketchPage key={`s-${i}`} pair={pair} index={i} />,
      <RightTextPage
        key={`t-${i}`}
        pair={pair}
        index={i}
        totalChapters={pairs.length}
      />,
    ]),
    <EndFlourish key="end" recipient={recipient} sender={sender} />,
  ];
  if (physicalPages.length % 2 !== 0) {
    physicalPages.push(<BlankPage key="blank" />);
  }
  const totalPhysical = physicalPages.length;

  const logicalCount = pairs.length + 2;
  const logicalToPhysical = (i: number) => {
    if (i === 0) return 0;
    if (i === logicalCount - 1) return 1 + 2 * pairs.length;
    return 1 + (i - 1) * 2;
  };
  const physicalToLogical = (p: number) => {
    if (p === 0) return 0;
    if (p >= 1 + 2 * pairs.length) return logicalCount - 1;
    return 1 + Math.floor((p - 1) / 2);
  };
  const activeLogical = physicalToLogical(page);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") flip()?.flipNext();
      if (e.key === "ArrowLeft") flip()?.flipPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-4">
      <div className="relative w-full max-w-3xl aspect-[3/2]">
        <HTMLFlipBook
          ref={bookRef}
          width={550}
          height={733}
          size="stretch"
          minWidth={315}
          maxWidth={1100}
          minHeight={420}
          maxHeight={1533}
          showCover
          usePortrait
          mobileScrollSupport
          flippingTime={700}
          maxShadowOpacity={0.4}
          drawShadow
          showPageCorners
          useMouseEvents
          clickEventForward
          swipeDistance={30}
          startPage={0}
          autoSize
          startZIndex={0}
          disableFlipByClick={false}
          className="story-book"
          style={{}}
          onFlip={(e: { data: number }) => setPage(e.data)}
        >
          {physicalPages}
        </HTMLFlipBook>
      </div>

      {/* dot pagination — one per chapter spread */}
      <div className="flex gap-2 mt-8">
        {Array.from({ length: logicalCount }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => flip()?.turnToPage(logicalToPhysical(i))}
            className="rounded-full pencil-cursor transition-all"
            style={{
              width: i === activeLogical ? 14 : 8,
              height: 8,
              background:
                i === activeLogical ? "#1a1a1a" : "rgba(26,26,26,0.25)",
            }}
            aria-label={`Page ${i + 1}`}
          />
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={() => flip()?.flipPrev()}
          disabled={page === 0}
          className="font-ui border border-ink/25 px-5 py-2 rounded-full hover:bg-ink/5 disabled:opacity-30 pencil-cursor"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={() => flip()?.flipNext()}
          disabled={page >= totalPhysical - 1}
          className="font-ui bg-ink text-paper px-5 py-2 rounded-full hover:bg-sketchPink disabled:opacity-30 pencil-cursor transition-colors"
        >
          Next page →
        </button>
      </div>
    </div>
  );
}

// ── BookPage wrapper (forwardRef required by react-pageflip) ───────────────

type BookPageProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const BookPage = forwardRef<HTMLDivElement, BookPageProps>(function BookPage(
  { children, className = "", style },
  ref
) {
  return (
    <div
      ref={ref}
      className={`bg-paper overflow-hidden ${className}`}
      style={style}
    >
      {children}
    </div>
  );
});

const BlankPage = forwardRef<HTMLDivElement>(function BlankPage(_, ref) {
  return <div ref={ref} className="bg-paper" />;
});

// ── Cover ──────────────────────────────────────────────────────────────────

const Cover = forwardRef<
  HTMLDivElement,
  {
    title: string;
    sender: string;
    recipient: string;
    secretKey: string;
    className?: string;
    style?: React.CSSProperties;
  }
>(function Cover({ title, sender, recipient, secretKey, className, style }, ref) {
  return (
    <BookPage ref={ref} className={className} style={style}>
      <div className="absolute inset-0 p-8 sm:p-14 flex flex-col items-center justify-center text-center">
        <RoughBox seed={9} roughness={2.0} strokeWidth={2.2} inset={14} />
        <div className="absolute top-6 left-6">
          <Doodle kind="swirl" color="#FF4D8D" size={28} />
        </div>
        <div className="absolute top-6 right-6">
          <Doodle kind="star" color="#F6C667" size={26} />
        </div>
        <div className="absolute bottom-6 left-6">
          <Doodle kind="spark" color="#4A90E2" size={26} />
        </div>
        <div className="absolute bottom-6 right-6">
          <Doodle kind="heart" color="#FF4D8D" size={26} />
        </div>

        <div className="font-ui text-xs uppercase tracking-[0.3em] text-ink/55 mb-4">
          A small book for {recipient || "you"}
        </div>
        <h1 className="font-display text-5xl sm:text-6xl mb-6">{title}</h1>
        <div className="font-hand text-ink/70 mb-2">
          written, for {recipient || "you"}
        </div>
        <div className="font-hand text-ink/70 mb-10">
          with love, from {sender || "an old friend"}
        </div>
        <div className="font-ui text-xs uppercase tracking-wider text-ink/40">
          key — {secretKey}
        </div>
      </div>
    </BookPage>
  );
});

// ── Left page: sketch ──────────────────────────────────────────────────────

const LeftSketchPage = forwardRef<
  HTMLDivElement,
  { pair: Pair; index: number; className?: string; style?: React.CSSProperties }
>(function LeftSketchPage({ pair, index, className, style }, ref) {
  const { sketch } = pair;
  return (
    <BookPage ref={ref} className={className} style={style}>
      <RoughBox seed={40 + index} strokeWidth={1.6} inset={10} />
      <div className="absolute inset-0 p-6 sm:p-10 flex items-center justify-center">
        <div
          className="w-full aspect-[4/3] overflow-hidden bg-paper relative"
          style={{ transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)` }}
        >
          {sketch?.Component && <sketch.Component />}
        </div>
      </div>
    </BookPage>
  );
});

// ── Right page: chapter text ───────────────────────────────────────────────

const RightTextPage = forwardRef<
  HTMLDivElement,
  {
    pair: Pair;
    index: number;
    totalChapters: number;
    className?: string;
    style?: React.CSSProperties;
  }
>(function RightTextPage({ pair, index, totalChapters, className, style }, ref) {
  const { chapter } = pair;
  return (
    <BookPage ref={ref} className={className} style={style}>
      <RoughBox seed={140 + index} strokeWidth={1.6} inset={10} />
      {chapter && (
        <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-center">
          <div className="font-ui text-xs uppercase tracking-wider text-ink/55 mb-2">
            Chapter {chapter.n} of {totalChapters}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl mb-4 leading-tight">
            {chapter.title}
          </h2>
          <p className="font-hand text-base sm:text-lg text-ink/85 leading-relaxed">
            {chapter.body}
          </p>
        </div>
      )}
    </BookPage>
  );
});

// ── End Flourish ───────────────────────────────────────────────────────────

const EndFlourish = forwardRef<
  HTMLDivElement,
  {
    recipient: string;
    sender: string;
    className?: string;
    style?: React.CSSProperties;
  }
>(function EndFlourish({ recipient, sender, className, style }, ref) {
  return (
    <BookPage ref={ref} className={className} style={style}>
      <div className="absolute inset-0 p-8 sm:p-14 flex flex-col items-center justify-center text-center">
        <RoughBox seed={120} roughness={2.0} strokeWidth={2.0} inset={14} />
        <div className="flex gap-3 mb-6">
          <Doodle kind="heart" color="#FF4D8D" size={28} drift={4} />
          <Doodle kind="star" color="#F6C667" size={28} drift={3.5} />
          <Doodle kind="swirl" color="#4A90E2" size={28} drift={3} />
        </div>
        <div className="font-display text-5xl mb-4">— the end —</div>
        <p className="font-hand text-ink/75 max-w-md">
          {recipient ? `For you, ${recipient}.` : "For you."} Written, drawn,
          and sent {sender ? `by ${sender}` : "with love"}.
        </p>
        <p className="font-hand text-ink/55 mt-8 text-sm">
          (close the tab gently, like you're closing a real book.)
        </p>
      </div>
    </BookPage>
  );
});
