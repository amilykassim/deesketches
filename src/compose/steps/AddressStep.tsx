import type { Address } from "../ComposePage";
import type { Payload } from "../../lib/payload";
import { RoughBox } from "../../components/RoughBox";
import { CharCounter } from "../../components/CharCounter";
import { useCharCount } from "../../lib/useCharCount";
import { BackButton } from "./OccasionStep";

const ADDRESS_MAX = 100;

type Props = {
  address: Address;
  payload: Payload | null;
  onChange: (a: Address) => void;
  onContinue: () => void;
  onBack: () => void;
};

export function AddressStep({
  address,
  payload,
  onChange,
  onContinue,
  onBack,
}: Props) {
  const ready =
    address.street.trim() &&
    address.city.trim() &&
    address.zip.trim() &&
    address.country.trim() &&
    Object.values(address).every((v) => v.length <= ADDRESS_MAX);

  const submit = () => {
    if (!payload) return;
    const subject = `Hand-made card order — ${payload.k}`;
    const body = [
      `From: ${payload.sender}`,
      `To: ${payload.recipient}`,
      `Occasion: ${payload.category}`,
      `Sketches (in order): ${payload.cardIds.join(", ")}`,
      `Secret key: ${payload.k}`,
      "",
      "Mailing address:",
      address.street,
      `${address.city}, ${address.region} ${address.zip}`,
      address.country,
      "",
      "Sent via the Andiko storybook composer.",
    ].join("\n");
    const url = `mailto:hello@andiko.studio?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank", "noopener");
    onContinue();
  };

  return (
    <section>
      <BackButton onClick={onBack} />
      <h1 className="font-display text-5xl text-center mb-3">
        Where shall we mail it?
      </h1>
      <p className="font-hand text-lg text-center text-ink/70 mb-10">
        We reply within 15 minutes!
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
        <Field label="Street address" value={address.street} onChange={(v) => onChange({ ...address, street: v })} className="sm:col-span-2" />
        <Field label="City" value={address.city} onChange={(v) => onChange({ ...address, city: v })} />
        <Field label="Region / State" value={address.region} onChange={(v) => onChange({ ...address, region: v })} />
        <Field label="Postcode" value={address.zip} onChange={(v) => onChange({ ...address, zip: v })} />
        <Field label="Country" value={address.country} onChange={(v) => onChange({ ...address, country: v })} />
      </div>
      <div className="flex justify-center mt-10">
        <button
          type="button"
          disabled={!ready}
          onClick={submit}
          className="font-ui bg-ink text-paper px-7 py-3 rounded-full hover:bg-sketchPink disabled:opacity-30 disabled:cursor-not-allowed pencil-cursor"
        >
          Email order to Andiko →
        </button>
      </div>
      <p className="font-hand text-sm text-center text-ink/55 mt-3">
        (Opens your mail app. The digital story is still revealed next.)
      </p>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const cnt = useCharCount(value, ADDRESS_MAX);
  return (
    <label className={`block relative bg-paper p-4 ${className}`}>
      <RoughBox seed={label.length * 7} strokeWidth={1.3} />
      <div className="flex items-baseline justify-between mb-1">
        <span className="block font-ui text-xs uppercase tracking-wider text-ink/55">
          {label}
        </span>
        <CharCounter state={cnt} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={ADDRESS_MAX}
        className="w-full bg-transparent font-hand text-lg text-ink placeholder-ink/30 focus:outline-none"
      />
    </label>
  );
}
