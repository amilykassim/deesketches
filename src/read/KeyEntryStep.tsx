import { useState } from "react";
import type { Payload } from "../lib/payload";
import { isValidKeyShape } from "../lib/key";
import { RoughBox } from "../components/RoughBox";
import { Doodle } from "../components/Doodle";

type Props = {
  hasPayload: boolean;
  decoded: Payload | null;
  onUnlock: () => void;
};

export function KeyEntryStep({ hasPayload, decoded, onUnlock }: Props) {
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const k = typed.trim().toUpperCase();
    if (!isValidKeyShape(k)) {
      setError("That doesn't look like a key — try WORD-WORD-NUMBER.");
      return;
    }
    if (!hasPayload || !decoded) {
      setError(
        "We don't have the story yet. Please open the link the sender shared with you."
      );
      return;
    }
    if (k !== decoded.k.toUpperCase()) {
      setError("That key doesn't match this link. Double-check with the sender?");
      return;
    }
    setError(null);
    onUnlock();
  };

  return (
    <section className="text-center pt-8">
      <div className="flex justify-center gap-3 mb-6">
        <Doodle kind="star" color="#F6C667" size={26} drift={3.5} />
        <Doodle kind="heart" color="#FF4D8D" size={26} drift={4} />
        <Doodle kind="spark" color="#4A90E2" size={26} drift={3} />
      </div>
      <h1 className="font-display text-5xl mb-3">A little book is waiting.</h1>
      <p className="font-hand text-lg text-ink/70 mb-10">
        Type the secret key the sender gave you.
      </p>
      <div className="relative bg-paper p-8 max-w-lg mx-auto" style={{ transform: "rotate(-0.6deg)" }}>
        <RoughBox seed={88} roughness={1.9} strokeWidth={1.8} />
        <input
          type="text"
          value={typed}
          onChange={(e) => {
            setTyped(e.target.value.toUpperCase());
            setError(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="VELVET-LARK-742"
          className="w-full bg-transparent text-center font-display text-3xl sm:text-4xl text-ink tracking-wide placeholder-ink/25 focus:outline-none"
          autoFocus
        />
      </div>
      {error && (
        <p className="font-hand text-sketchPink mt-6 max-w-lg mx-auto">{error}</p>
      )}
      <div className="mt-8">
        <button
          type="button"
          onClick={submit}
          className="font-ui bg-ink text-paper px-7 py-3 rounded-full hover:bg-sketchPink pencil-cursor transition-colors"
        >
          Open the book →
        </button>
      </div>
      {!hasPayload && (
        <p className="font-hand text-sm text-ink/55 mt-10 max-w-lg mx-auto">
          (Heads up: this site stores nothing. The story rides along inside the
          link itself, so you'll need to open the full link your sender shared.)
        </p>
      )}
    </section>
  );
}
