"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Props = {
  url: string;
  sender: string;
  recipient: string;
  onCopy: () => void;
  copied: boolean;
};

const SUBJECT = "A little note book for you";

export function ShareMenu({ url, sender, recipient, onCopy, copied }: Props) {
  const [open, setOpen] = useState(false);
  const [hasNativeShare, setHasNativeShare] = useState(false);
  const [igHint, setIgHint] = useState(false);
  const reduce = useReducedMotion();

  // Detect Web Share API after mount (SSR-safe).
  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setHasNativeShare(true);
    }
  }, []);

  // Close on Escape and lock body scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Auto-clear the Instagram hint after a moment.
  useEffect(() => {
    if (!igHint) return;
    const t = setTimeout(() => setIgHint(false), 2400);
    return () => clearTimeout(t);
  }, [igHint]);

  const text = `${sender || "Someone"} sent you a little note book ✎`;
  const body = `${text}\n${url}`;

  const channels = [
    {
      label: "WhatsApp",
      color: "#25D366",
      href: `https://wa.me/?text=${encodeURIComponent(body)}`,
      external: true,
      Icon: WhatsAppIcon,
    },
    {
      label: "Messages",
      color: "#007AFF",
      href: `sms:?body=${encodeURIComponent(body)}`,
      external: false,
      Icon: ChatIcon,
    },
    {
      label: "Email",
      color: "#FF8A3C",
      href: `mailto:?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(body)}`,
      external: false,
      Icon: MailIcon,
    },
    {
      label: "Telegram",
      color: "#26A5E4",
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      external: true,
      Icon: TelegramIcon,
    },
  ];

  const onInstagramClick = () => {
    if (hasNativeShare) {
      void navigator
        .share({
          title: `A little note book for ${recipient || "you"}`,
          text,
          url,
        })
        .catch(() => {
          /* user cancelled — no-op */
        });
      setOpen(false);
    } else {
      onCopy();
      setIgHint(true);
    }
  };

  const onMoreClick = () => {
    void navigator
      .share({
        title: `A little note book for ${recipient || "you"}`,
        text,
        url,
      })
      .catch(() => {
        /* user cancelled — no-op */
      });
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="font-ui bg-ink text-paper px-5 py-2 rounded-full hover:bg-sketchPink pencil-cursor"
      >
        Share link
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="share-modal"
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Share this note"
          >
            {/* Modal card */}
            <motion.div
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
              transition={reduce ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-paper border border-ink/15 rounded-sm p-5 sm:p-6 text-left"
              style={{
                boxShadow: "10px 12px 0 rgba(26,26,26,0.12)",
                transform: "rotate(-0.4deg)",
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-display text-2xl leading-none">Share the note</h2>
                  <p className="font-hand text-sm text-ink/60 mt-1">
                    Pick how to send it to {recipient || "the recipient"}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="font-ui text-ink/55 hover:text-ink text-xl leading-none px-1 pencil-cursor"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {channels.map(({ label, color, href, external, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 font-ui text-sm py-2 px-3 rounded-full border border-ink/15 hover:bg-ink/5 pencil-cursor"
                  >
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 shrink-0 rounded-full"
                      style={{ background: `${color}22`, color }}
                    >
                      <Icon />
                    </span>
                    <span className="truncate">{label}</span>
                  </a>
                ))}
                <button
                  type="button"
                  onClick={onInstagramClick}
                  className="flex items-center gap-2 font-ui text-sm py-2 px-3 rounded-full border border-ink/15 hover:bg-ink/5 pencil-cursor col-span-2"
                >
                  <span
                    className="inline-flex items-center justify-center w-7 h-7 shrink-0 rounded-full"
                    style={{ background: "#E1306C22", color: "#E1306C" }}
                  >
                    <InstagramIcon />
                  </span>
                  <span className="truncate">
                    {hasNativeShare ? "Instagram (via share sheet)" : "Copy for Instagram"}
                  </span>
                </button>
              </div>

              {igHint && (
                <p className="font-hand text-sm text-ink/65 mt-3 text-center">
                  Copied! Paste it in your Instagram DM ✎
                </p>
              )}

              <motion.button
                type="button"
                onClick={() => {
                  onCopy();
                }}
                animate={
                  copied
                    ? reduce
                      ? { scale: 1 }
                      : { scale: [1, 1.04, 1] }
                    : { scale: 1 }
                }
                transition={
                  reduce ? { duration: 0 } : { duration: 0.35, ease: "easeOut" }
                }
                className={`w-full mt-4 flex items-center justify-center gap-2 font-ui text-sm py-2.5 px-3 rounded-full pencil-cursor transition-colors duration-300 border ${
                  copied
                    ? "border-sketchGreen text-sketchGreen"
                    : "border-ink hover:bg-ink hover:text-paper"
                }`}
              >
                <CopyIcon />
                <span>{copied ? "✓ Copied! Link's on your clipboard" : "Copy link"}</span>
              </motion.button>

              {hasNativeShare && (
                <button
                  type="button"
                  onClick={onMoreClick}
                  className="w-full mt-2 font-ui text-xs text-ink/60 hover:text-ink py-1.5 pencil-cursor"
                >
                  More apps…
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Inline icon glyphs ────────────────────────────────────────────────────

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12 0C5.4 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.96L0 24l6.2-1.62A12 12 0 0 0 12 24c6.6 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52ZM12 21.8a9.78 9.78 0 0 1-4.96-1.36l-.36-.21-3.69.97.99-3.6-.24-.37A9.7 9.7 0 0 1 2.18 12C2.18 6.6 6.6 2.18 12 2.18S21.82 6.6 21.82 12 17.4 21.8 12 21.8Zm5.42-7.32c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.5.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.21 5.1 4.5.71.3 1.27.49 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"/>
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3C6.48 3 2 6.94 2 11.5c0 2.36 1.2 4.49 3.13 5.99l-.99 3.5 3.81-1.96c1.27.4 2.64.62 4.05.62 5.52 0 10-3.94 10-8.65S17.52 3 12 3Z"/>
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 7 9-7" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.78 16.86 9.6 21.3c.36 0 .51-.15.7-.34l1.68-1.6 3.48 2.55c.64.36 1.1.17 1.27-.59l2.3-10.78c.21-.95-.34-1.32-.96-1.09L3.66 9.62c-.93.36-.91.88-.16 1.12l3.95 1.23 9.18-5.78c.43-.28.83-.13.5.16Z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}
