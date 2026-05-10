import { motion } from "framer-motion";
import { useState } from "react";
import { RoughBox } from "./RoughBox";
import { RoughUnderline } from "./RoughUnderline";
import { Doodle } from "./Doodle";

const EMAIL = "hello@andiko.studio";
// WhatsApp number in international format, digits only (no '+', spaces, or dashes).
// Replace with the studio's real number.
const WHATSAPP_NUMBER = "250788459885";

export function Contact() {
  const [idea, setIdea] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) {
      setError("Write your idea first 😁 even one wobbly sentence is enough.");
      return;
    }
    setError("");
    const text = encodeURIComponent(
      `Hi! I'd love a sketch.\n\n${idea}\n\nSent from andiko.studio`
    );
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`,
      "_blank",
      "noopener"
    );
  };

  return (
    <section id="contact" className="relative py-28 px-5 bg-paper">
      <Doodle kind="heart" color="#FF4D8D" size={28} drift={5} className="absolute top-12 left-[8%]" rotate={-10} />
      <Doodle kind="swirl" color="#4A90E2" size={36} drift={6} className="absolute bottom-12 right-[10%]" />

      <div className="max-w-3xl mx-auto text-center mb-12">
        <p className="font-ui uppercase tracking-[0.25em] text-xs text-ink/50 mb-3">
          ~ Got an idea? Let's do it ~
        </p>
        <h2 className="font-display text-5xl md:text-6xl text-ink leading-tight mb-4">
          Tell me <span className="text-sketchPink">about it</span>.
        </h2>
        <p className="font-hand text-lg text-ink/75">
          A name, a moment, a pun you can't stop thinking about. I'll sketch back
          within 1 hour.
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative max-w-2xl mx-auto bg-paper p-8 md:p-10"
        style={{ boxShadow: "12px 16px 0 rgba(255,77,141,0.15)" }}
      >
        <RoughBox seed={71} strokeWidth={2} roughness={1.6} />

        <div className="relative grid gap-6">
          <Field
            label="The sketch idea"
            value={idea}
            onChange={(v) => {
              setIdea(v);
              if (error) setError("");
            }}
            multiline
            placeholder="My friend turns 30. She loves cats and bad puns. Send help."
          />

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              aria-live="polite"
              className="font-hand text-base text-sketchPink -mt-3"
            >
              {error}
            </motion.p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
            <button
              type="submit"
              className="relative px-7 py-3.5 font-ui text-lg text-paper bg-ink pencil-cursor"
            >
              <RoughBox seed={91} strokeColor="#FF4D8D" strokeWidth={2} roughness={2} />
              <span className="relative inline-flex items-center gap-2">
                Send the idea via WhatsApp
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.52 3.48A11.78 11.78 0 0 0 12.04 0C5.5 0 .2 5.3.2 11.84a11.7 11.7 0 0 0 1.6 5.92L0 24l6.4-1.68a11.83 11.83 0 0 0 5.64 1.44h.01c6.54 0 11.84-5.3 11.84-11.84a11.78 11.78 0 0 0-3.37-8.44ZM12.05 21.6h-.01a9.74 9.74 0 0 1-4.96-1.36l-.36-.21-3.8 1 1.02-3.7-.24-.38a9.74 9.74 0 0 1-1.5-5.21c0-5.4 4.4-9.8 9.86-9.8 2.63 0 5.1 1.03 6.97 2.9a9.78 9.78 0 0 1 2.88 6.94c0 5.4-4.4 9.82-9.86 9.82Zm5.4-7.34c-.3-.15-1.76-.87-2.03-.97-.27-.1-.46-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47a9 9 0 0 1-1.66-2.06c-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.91-2.18-.24-.57-.48-.5-.66-.5l-.56-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.71.23 1.36.2 1.88.12.57-.08 1.76-.72 2-1.42.25-.7.25-1.3.18-1.42-.07-.13-.27-.2-.57-.35Z" />
                </svg>
              </span>
            </button>
            <a
              href={`mailto:${EMAIL}`}
              className="font-hand text-ink/70 hover:text-sketchPink transition-colors"
            >
              Or email me directly · {EMAIL}
            </a>
          </div>
        </div>
      </motion.form>
    </section>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
};

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  multiline = false,
}: FieldProps) {
  return (
    <label className="block">
      <span className="font-ui text-xs uppercase tracking-[0.2em] text-ink/50">
        {label}
      </span>
      <div className="relative mt-2">
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={4}
            className="w-full bg-transparent font-hand text-lg text-ink placeholder:text-ink/35 focus:outline-none resize-none pb-2"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent font-hand text-lg text-ink placeholder:text-ink/35 focus:outline-none pb-2"
          />
        )}
        <div className="absolute -bottom-1 left-0 right-0">
          <RoughUnderline color="#1a1a1a" thickness={2} seed={multiline ? 15 : 7} />
        </div>
      </div>
    </label>
  );
}
