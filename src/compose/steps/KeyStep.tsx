import { useState } from "react";
import { isValidKeyShape, keyToSeed } from "../../lib/key";
import { RoughBox } from "../../components/RoughBox";
import { BackButton } from "./OccasionStep";

type Props = {
  value: string;
  onContinue: (key: string, seed: number) => void;
  onBack: () => void;
};

export function KeyStep({ value, onContinue, onBack }: Props) {
  const [typed, setTyped] = useState(value);
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = typed.trim();
  const ready = isValidKeyShape(typed);

  const submit = () => {
    if (!ready) {
      setError(
        trimmed.length === 0
          ? "Pick a password first."
          : "Keep it under 64 characters.",
      );
      return;
    }
    setError(null);
    onContinue(trimmed, keyToSeed(trimmed));
  };

  return (
    <section>
      <BackButton onClick={onBack} />
      <h1 className="font-display text-5xl text-center mb-3">
        Set a password.
      </h1>
      <p className="font-hand text-lg text-center text-ink/70 mb-10 max-w-xl mx-auto">
        Pick a password and share it with the recipient — they'll need it to
        open the book. Write it down somewhere; if it's lost it can't be
        recovered.
      </p>
      <label className="block relative bg-paper p-5 max-w-xl mx-auto">
        <RoughBox seed={73} strokeWidth={1.4} />
        <span className="block font-ui text-xs uppercase tracking-wider text-ink/55 mb-2">
          Password
        </span>
        <div className="flex items-center gap-3">
          <input
            type={reveal ? "text" : "password"}
            value={typed}
            placeholder="something only you two will know"
            onChange={(e) => {
              setTyped(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="w-full bg-transparent font-hand text-2xl text-ink placeholder-ink/30 focus:outline-none"
            autoFocus
            maxLength={64}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            className="font-ui text-xs uppercase tracking-wider text-ink/55 hover:text-ink pencil-cursor"
          >
            {reveal ? "Hide" : "Show"}
          </button>
        </div>
      </label>
      {error && (
        <p className="font-hand text-sketchPink mt-4 text-center max-w-xl mx-auto">
          {error}
        </p>
      )}
      <div className="flex justify-center mt-10">
        <button
          type="button"
          disabled={!ready}
          onClick={submit}
          className="font-ui bg-ink text-paper px-7 py-3 rounded-full hover:bg-sketchPink disabled:opacity-30 disabled:cursor-not-allowed pencil-cursor transition-colors"
        >
          Continue →
        </button>
      </div>
    </section>
  );
}
