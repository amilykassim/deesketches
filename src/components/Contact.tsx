import { motion } from "framer-motion";
import { useState } from "react";
import { RoughBox } from "./RoughBox";
import { RoughUnderline } from "./RoughUnderline";
import { Doodle } from "./Doodle";

const EMAIL = "hello@tinynotes.studio";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [idea, setIdea] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Sketch idea from ${name || "a stranger"}`);
    const body = encodeURIComponent(
      `Hi! I'd love a sketch.\n\nName: ${name}\nEmail: ${email}\n\nIdea:\n${idea}\n\n— Sent from tinynotes.studio`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
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
          Tell me <span className="text-sketchPink">about them</span>.
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
            label="Your name"
            value={name}
            onChange={setName}
            placeholder="e.g. Priya"
          />
          <Field
            label="Your email"
            value={email}
            onChange={setEmail}
            type="email"
            placeholder="hello@example.com"
          />
          <Field
            label="The sketch idea"
            value={idea}
            onChange={setIdea}
            multiline
            placeholder="My friend turns 30. She loves cats and bad puns. Send help."
          />

          <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
            <button
              type="submit"
              className="relative px-7 py-3.5 font-ui text-lg text-paper bg-ink pencil-cursor"
            >
              <RoughBox seed={91} strokeColor="#FF4D8D" strokeWidth={2} roughness={2} />
              <span className="relative">Send the idea →</span>
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
