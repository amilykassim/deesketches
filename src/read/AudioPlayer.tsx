import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
};

export function AudioPlayer({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.6;
    audioRef.current = audio;

    const tryPlay = async () => {
      try {
        await audio.play();
        setNeedsTap(false);
      } catch {
        setNeedsTap(true);
      }
    };
    void tryPlay();

    const onVisibility = () => {
      if (document.visibilityState === "hidden") audio.pause();
      else if (!muted && !needsTap) void audio.play().catch(() => setNeedsTap(true));
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", () => audio.pause());

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  const tapToPlay = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      setNeedsTap(false);
    } catch {
      setNeedsTap(true);
    }
  };

  return (
    <div className="fixed top-24 right-5 z-30 flex items-center gap-2">
      {needsTap && (
        <button
          type="button"
          onClick={tapToPlay}
          className="font-ui text-xs bg-ink text-paper px-3 py-1.5 rounded-full hover:bg-sketchPink"
        >
          🔊 Tap to play music
        </button>
      )}
      {!needsTap && (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="font-ui text-xs bg-paper border border-ink/20 text-ink/70 px-3 py-1.5 rounded-full hover:bg-ink/5"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? "🔇" : "🔊"}
        </button>
      )}
    </div>
  );
}
