"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { RoughBox } from "./RoughBox";
import { Doodle } from "./Doodle";

const STORAGE_KEY = "welcome_modal_dismissed_v1";

type Props = {
  onClose: () => void;
};

export function WelcomeModal({ onClose }: Props) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const firstButton = dialogRef.current?.querySelector<HTMLButtonElement>(
      "button[data-autofocus]",
    );
    firstButton?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dismiss();
      } else if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore (private mode, quota, etc.)
    }
    onClose();
  };

  const goToRead = () => {
    dismiss();
    router.push("/read");
  };

  const sheetTransition = reduce
    ? { duration: 0 }
    : { type: "spring" as const, damping: 28, stiffness: 240 };

  const backdropTransition = reduce ? { duration: 0 } : { duration: 0.2 };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={backdropTransition}
        onClick={dismiss}
        className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
        aria-hidden="true"
      />
      <motion.div
        key="dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        initial={
          reduce
            ? { opacity: 1 }
            : isMobile
            ? { y: "100%", opacity: 0.6 }
            : { opacity: 0, scale: 0.96, y: 12 }
        }
        animate={
          reduce
            ? { opacity: 1 }
            : isMobile
            ? { y: 0, opacity: 1 }
            : { opacity: 1, scale: 1, y: 0 }
        }
        exit={
          reduce
            ? { opacity: 0 }
            : isMobile
            ? { y: "100%", opacity: 0.4 }
            : { opacity: 0, scale: 0.96, y: 12 }
        }
        transition={sheetTransition}
        onClick={(e) => e.stopPropagation()}
        className={
          isMobile
            ? "fixed inset-x-0 bottom-0 z-50 bg-paper p-7 pt-8 pb-10 rounded-t-3xl"
            : "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-paper p-9 max-w-md w-[92vw]"
        }
        style={
          isMobile
            ? { boxShadow: "0 -16px 40px rgba(26,26,26,0.18)" }
            : { boxShadow: "12px 16px 0 rgba(26,26,26,0.14)" }
        }
      >
        {!isMobile && <RoughBox seed={71} roughness={1.7} strokeWidth={2} />}
        {isMobile && (
          <div
            aria-hidden="true"
            className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-ink/15"
          />
        )}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-3 right-4 font-display text-3xl text-ink/55 hover:text-sketchPink leading-none"
        >
          ×
        </button>
        <div className="relative text-center">
          <div className="flex justify-center gap-2 mb-3">
            <Doodle kind="heart" color="#FF4D8D" size={22} drift={3} />
            <Doodle kind="star" color="#F6C667" size={22} drift={3.5} />
            <Doodle kind="spark" color="#4A90E2" size={22} drift={2.5} />
          </div>
          <h2
            id="welcome-title"
            className="font-display text-3xl sm:text-4xl text-ink mb-2"
          >
            Hi there!
          </h2>
          <p className="font-hand text-base sm:text-lg text-ink/80 mb-7 max-w-sm mx-auto">
            Are you here to read a note someone sent you?
          </p>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              data-autofocus
              onClick={goToRead}
              className="w-full font-ui bg-ink text-paper px-6 py-3 rounded-full hover:bg-sketchPink pencil-cursor"
            >
              Yes, I have a key →
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="w-full font-ui border border-ink/25 px-6 py-3 rounded-full hover:bg-ink/5 pencil-cursor"
            >
              No, just looking around
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function shouldShowWelcomeModal(pathname: string): boolean {
  if (typeof window === "undefined") return false;
  if (pathname.startsWith("/read")) return false;
  if (pathname.startsWith("/admin")) return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "1";
  } catch {
    return false;
  }
}
