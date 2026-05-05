import { RoughBox } from "../../components/RoughBox";
import { BackButton } from "./OccasionStep";

type Props = {
  sender: string;
  recipient: string;
  onChange: (sender: string, recipient: string) => void;
  onContinue: () => void;
  onBack: () => void;
};

export function NamesStep({
  sender,
  recipient,
  onChange,
  onContinue,
  onBack,
}: Props) {
  const ready = sender.trim().length > 0 && recipient.trim().length > 0;
  return (
    <section>
      <BackButton onClick={onBack} />
      <h1 className="font-display text-5xl text-center mb-3">
        Who's it from? Who's it for?
      </h1>
      <p className="font-hand text-lg text-center text-ink/70 mb-10">
        These appear on the cover of the little book.
      </p>
      <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Field
          label="From"
          value={sender}
          placeholder="your name"
          onChange={(v) => onChange(v, recipient)}
        />
        <Field
          label="To"
          value={recipient}
          placeholder="their name"
          onChange={(v) => onChange(sender, v)}
        />
      </div>
      <div className="flex justify-center mt-10">
        <button
          type="button"
          disabled={!ready}
          onClick={onContinue}
          className="font-ui bg-ink text-paper px-7 py-3 rounded-full hover:bg-sketchPink disabled:opacity-30 disabled:cursor-not-allowed pencil-cursor transition-colors"
        >
          Continue →
        </button>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block relative bg-paper p-5">
      <RoughBox seed={label === "From" ? 71 : 72} strokeWidth={1.4} />
      <span className="block font-ui text-xs uppercase tracking-wider text-ink/55 mb-2">
        {label}
      </span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent font-hand text-2xl text-ink placeholder-ink/30 focus:outline-none"
      />
    </label>
  );
}
