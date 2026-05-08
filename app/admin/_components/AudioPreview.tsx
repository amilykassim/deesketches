"use client";

import { useRef, useState } from "react";

export function AudioPreview({ url }: { url: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      void a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className="font-ui text-sm border border-ink/20 px-3 py-1 rounded-full hover:bg-ink/5"
      >
        {playing ? "❚❚ Pause" : "▶ Play"}
      </button>
      <audio
        ref={ref}
        src={url}
        onEnded={() => setPlaying(false)}
        preload="none"
      />
    </>
  );
}
