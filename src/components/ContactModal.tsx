import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { RoughBox } from "./RoughBox";
import { RoughUnderline } from "./RoughUnderline";
import type { Sketch } from "../data/sketches";

const EMAIL = "hello@andiko.studio";

type Props = {
  open: boolean;
  sketch: Sketch | null;
  onClose: () => void;
};

export function ContactModal({ open, sketch, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) setNote("");
  }, [open, sketch]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const title = sketch ? sketch.title : "a custom sketch";
    const subject = encodeURIComponent(`Sketch inquiry: ${title}`);
    const body = encodeURIComponent(
      `Hi! I'd like to order "${title}".\n\nName: ${name}\nEmail: ${email}\n\nNote:\n${note}\n\n— Sent from andiko.studio`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -2, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, rotate: -1, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative bg-paper p-7 md:p-9 w-full max-w-lg"
            style={{ boxShadow: "14px 18px 0 rgba(255,77,141,0.22)" }}
          >
            <RoughBox seed={37} strokeWidth={2} roughness={1.6} />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 w-9 h-9 grid place-items-center font-display text-2xl text-ink hover:text-sketchPink transition-colors pencil-cursor"
            >
              ×
            </button>

            <div className="relative">
              <p className="font-ui uppercase tracking-[0.2em] text-[10px] text-ink/50 mb-1">
                Inquiry
              </p>
              <h3 className="font-display text-3xl text-ink leading-tight mb-1">
                {sketch ? sketch.title : "Got an idea? Let's do it!"}
              </h3>
              <div className="w-32"><RoughUnderline color="#FF4D8D" /></div>
              <p className="font-hand text-base text-ink/75 mt-3">
                Drop your details and a note. I'll reply by email within 48 hours
                with availability and pricing.
              </p>

              <form onSubmit={send} className="mt-6 grid gap-5">
                <ModalField
                  label="Name"
                  value={name}
                  onChange={setName}
                  required
                />
                <ModalField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  required
                />
                <ModalField
                  label="Note (optional)"
                  value={note}
                  onChange={setNote}
                  multiline
                />
                <button
                  type="submit"
                  className="relative mt-2 px-6 py-3 font-ui text-base text-paper bg-ink pencil-cursor"
                >
                  <RoughBox seed={45} strokeColor="#FF4D8D" strokeWidth={2} roughness={2} />
                  <span className="relative">Send via email →</span>
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
  required?: boolean;
};

function ModalField({ label, value, onChange, type = "text", multiline, required }: FieldProps) {
  return (
    <label className="block">
      <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-ink/50">
        {label}
      </span>
      <div className="relative mt-1">
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full bg-transparent font-hand text-base text-ink focus:outline-none resize-none pb-1"
          />
        ) : (
          <input
            required={required}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent font-hand text-base text-ink focus:outline-none pb-1"
          />
        )}
        <div className="absolute -bottom-1 left-0 right-0">
          <RoughUnderline color="#1a1a1a" thickness={1.6} seed={multiline ? 22 : 12} />
        </div>
      </div>
    </label>
  );
}
