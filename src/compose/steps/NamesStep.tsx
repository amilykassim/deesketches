import { RoughBox } from "../../components/RoughBox";
import { CharCounter } from "../../components/CharCounter";
import { useCharCount } from "../../lib/useCharCount";
import { BackButton } from "./OccasionStep";

const NAME_MAX = 50;

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
  const ready =
    sender.trim().length > 0 &&
    recipient.trim().length > 0 &&
    sender.length <= NAME_MAX &&
    recipient.length <= NAME_MAX;
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
          className="font-ui bg-ink text-paper px-7 py-3 rounded-full hover:bg-sketchPink disabled:opacity-30 disabled:cursor-not-allowed pencil-cursor"
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
  const cnt = useCharCount(value, NAME_MAX);
  return (
    <label className="block relative bg-paper p-5">
      <RoughBox seed={label === "From" ? 71 : 72} strokeWidth={1.4} />
      <div className="flex items-baseline justify-between mb-2">
        <span className="block font-ui text-xs uppercase tracking-wider text-ink/55">
          {label}
        </span>
        <CharCounter state={cnt} />
      </div>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        maxLength={NAME_MAX}
        className="w-full bg-transparent font-hand text-2xl text-ink placeholder-ink/30 focus:outline-none"
      />
    </label>
  );
}
