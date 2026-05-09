"use client";

import { useEffect, useRef, useState } from "react";
import { RoughBox } from "../../components/RoughBox";
import { CharCounter } from "../../components/CharCounter";
import { useCharCount } from "../../lib/useCharCount";
import { useStreamText } from "../../lib/streamText";

type Chapter = { title: string; body: string };

type Props = {
  chapters: Chapter[];
  count: number;
  storySource: "self" | "magic_writer" | null;
  onChange: (chapters: Chapter[]) => void;
  onContinue: () => void;
  onBack: () => void;
};

// Chapter body cap. Empirically derived from the book reader layout
// (StoryReader.tsx renders chapter body in a ~half-page panel at min
// width 315px / min height 420px). At ~16px font with leading-relaxed,
// ~280-300 chars stays well within the page. 350 leaves ~15% headroom.
// Adjust if the book layout changes.
const CHAPTER_TITLE_MAX = 60;
const CHAPTER_BODY_MAX = 350;

export function EditorStep({
  chapters,
  count,
  storySource,
  onChange,
  onContinue,
  onBack,
}: Props) {
  const safeChapters: Chapter[] =
    chapters.length === count
      ? chapters
      : Array.from({ length: count }, (_, i) => chapters[i] ?? { title: "", body: "" });

  // Decide whether to stream once at mount. We capture the magic-writer
  // bodies so later edits don't restart the animation.
  const [streamSource] = useState<string[]>(() =>
    storySource === "magic_writer" ? safeChapters.map((c) => c.body) : [],
  );
  const [skipAll, setSkipAll] = useState(false);
  const [streamingCount, setStreamingCount] = useState(streamSource.length);

  const update = (i: number, patch: Partial<Chapter>) => {
    const next = safeChapters.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
    onChange(next);
  };

  const ready = safeChapters.every(
    (c) =>
      c.title.trim() &&
      c.body.trim() &&
      c.title.length <= CHAPTER_TITLE_MAX &&
      c.body.length <= CHAPTER_BODY_MAX,
  );

  const anyStreaming = streamingCount > 0 && !skipAll;

  return (
    <section>
      <header className="text-center mb-8">
        <h2 className="font-display text-4xl mb-2">Write your chapters</h2>
        <p className="font-hand text-lg text-ink/70">
          One chapter per page. Edit until it sounds like you.
        </p>
        {anyStreaming && (
          <button
            type="button"
            onClick={() => setSkipAll(true)}
            className="mt-3 font-ui text-sm text-ink/60 hover:text-sketchPink underline underline-offset-4 pencil-cursor"
          >
            Skip the animation
          </button>
        )}
      </header>

      <div className="space-y-6">
        {safeChapters.map((c, i) => (
          <ChapterEditor
            key={i}
            index={i}
            count={count}
            chapter={c}
            streamSource={streamSource[i] ?? null}
            skipStream={skipAll}
            onStreamDone={() =>
              setStreamingCount((n) => Math.max(0, n - 1))
            }
            onUpdate={(p) => update(i, p)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mt-10">
        <button type="button" onClick={onBack} className="font-ui text-ink/55 hover:text-ink">
          ← Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!ready || anyStreaming}
          className="font-ui bg-ink text-paper px-6 py-3 rounded-full hover:bg-sketchPink pencil-cursor disabled:opacity-50"
        >
          Continue →
        </button>
      </div>
    </section>
  );
}

function ChapterEditor({
  index,
  count,
  chapter,
  streamSource,
  skipStream,
  onStreamDone,
  onUpdate,
}: {
  index: number;
  count: number;
  chapter: Chapter;
  streamSource: string | null;
  skipStream: boolean;
  onStreamDone: () => void;
  onUpdate: (patch: Partial<Chapter>) => void;
}) {
  const titleCount = useCharCount(chapter.title, CHAPTER_TITLE_MAX);
  const bodyCount = useCharCount(chapter.body, CHAPTER_BODY_MAX);
  const willStream = streamSource !== null && streamSource.length > 0;
  const stream = useStreamText(streamSource ?? "", willStream && !skipStream, index);
  const doneFiredRef = useRef(false);

  useEffect(() => {
    if (!willStream) return;
    if (!stream.isStreaming && !doneFiredRef.current) {
      doneFiredRef.current = true;
      onStreamDone();
    }
  }, [stream.isStreaming, willStream, onStreamDone]);

  useEffect(() => {
    if (!willStream) return;
    if (skipStream) stream.skip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipStream, willStream]);

  const showOverlay = willStream && stream.isStreaming;

  return (
    <div
      className="relative bg-paper p-6"
      style={{ boxShadow: "4px 4px 0 #1a1a1a18" }}
    >
      <RoughBox seed={300 + index} roughness={1.6} strokeWidth={1.5} />
      <div className="flex items-baseline justify-between mb-2">
        <div className="font-ui text-xs uppercase tracking-wider text-ink/55">
          Chapter {index + 1} of {count}
        </div>
        {!showOverlay && <CharCounter state={titleCount} />}
      </div>
      <input
        type="text"
        value={chapter.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="Chapter title"
        maxLength={CHAPTER_TITLE_MAX}
        readOnly={showOverlay}
        className="w-full bg-transparent font-display text-2xl text-ink placeholder-ink/30 focus:outline-none mb-3"
      />

      {showOverlay ? (
        <div
          aria-live="polite"
          className="font-hand text-ink/85 leading-relaxed whitespace-pre-wrap min-h-[7.5rem]"
        >
          {stream.visible}
          <span className="magic-cursor" aria-hidden="true" />
        </div>
      ) : (
        <textarea
          value={chapter.body}
          onChange={(e) => onUpdate({ body: e.target.value })}
          placeholder="Write the chapter here…"
          rows={5}
          maxLength={CHAPTER_BODY_MAX}
          className="w-full bg-transparent font-hand text-ink/85 placeholder-ink/30 focus:outline-none resize-none leading-relaxed"
        />
      )}
      {!showOverlay && (
        <div className="flex justify-end mt-1">
          <CharCounter state={bodyCount} />
        </div>
      )}
    </div>
  );
}
