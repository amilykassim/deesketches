import { useEffect, useRef, useState } from "react";
import { RoughBox } from "../../components/RoughBox";

type Clip = {
  id: string;
  title: string;
  mood: string | null;
  url: string;
  durationSec: number;
};

type Props = {
  audioClipId: string | null;
  onChange: (id: string | null) => void;
  onContinue: () => void;
  onBack: () => void;
};

function fmtDuration(seconds: number): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioStep({ audioClipId, onChange, onContinue, onBack }: Props) {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/audio")
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        setClips(j.clips ?? []);
      })
      .catch((e) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load clips");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const togglePreview = (clip: Clip) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (playingId === clip.id) {
      setPlayingId(null);
      return;
    }
    const a = new Audio(clip.url);
    a.onended = () => setPlayingId(null);
    audioRef.current = a;
    void a.play().then(() => setPlayingId(clip.id)).catch(() => setPlayingId(null));
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  return (
    <section>
      <header className="text-center mb-8">
        <h2 className="font-display text-4xl mb-2">Add a soundtrack?</h2>
        <p className="font-hand text-lg text-ink/70">
          Optional — the music plays softly while {`<recipient>`} reads the book.
        </p>
      </header>

      <div className="space-y-3 max-w-2xl mx-auto">
        <ClipRow
          selected={audioClipId === null}
          onSelect={() => onChange(null)}
        >
          <span className="font-display text-xl">No music</span>
          <span className="font-hand text-ink/55 text-sm">Silent reading</span>
        </ClipRow>

        {loading && <p className="font-hand text-ink/55 text-center">Loading clips…</p>}
        {error && <p className="font-hand text-sketchPink text-center">{error}</p>}

        {clips.map((c) => (
          <ClipRow
            key={c.id}
            selected={audioClipId === c.id}
            onSelect={() => onChange(c.id)}
          >
            <div className="flex-1">
              <div className="font-display text-xl">{c.title}</div>
              <div className="font-hand text-ink/55 text-sm">
                {c.mood ?? "—"} · {fmtDuration(c.durationSec)}
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePreview(c);
              }}
              className="font-ui text-sm border border-ink/20 px-3 py-1 rounded-full hover:bg-ink/5"
            >
              {playingId === c.id ? "❚❚" : "▶"}
            </button>
          </ClipRow>
        ))}
      </div>

      <div className="flex items-center justify-between mt-10 max-w-2xl mx-auto">
        <button type="button" onClick={onBack} className="font-ui text-ink/55 hover:text-ink">
          ← Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="font-ui bg-ink text-paper px-6 py-3 rounded-full hover:bg-sketchPink pencil-cursor transition-colors"
        >
          Continue →
        </button>
      </div>
    </section>
  );
}

function ClipRow({
  selected,
  onSelect,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="relative w-full p-4 text-left bg-paper flex items-center gap-3 transition-shadow"
      style={{
        boxShadow: selected ? "4px 4px 0 #FF4D8D" : "2px 2px 0 #1a1a1a18",
      }}
    >
      <RoughBox seed={selected ? 800 : 700} roughness={1.4} strokeWidth={selected ? 2 : 1.4} />
      {children}
    </button>
  );
}
