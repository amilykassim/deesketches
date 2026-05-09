"use client";

import { createContext, useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { Navbar } from "../src/components/Navbar";
import { Footer } from "../src/components/Footer";
import { shouldShowWelcomeModal } from "../src/components/WelcomeModal";
import type { Sketch } from "../src/data/sketches";

const ContactModal = dynamic(
  () =>
    import("../src/components/ContactModal").then((m) => ({
      default: m.ContactModal,
    })),
  { ssr: false }
);

const WelcomeModal = dynamic(
  () =>
    import("../src/components/WelcomeModal").then((m) => ({
      default: m.WelcomeModal,
    })),
  { ssr: false }
);

type ContactModalCtx = {
  open: (sketch?: Sketch | null) => void;
};

const Ctx = createContext<ContactModalCtx | null>(null);

export function useContactModal(): ContactModalCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useContactModal must be used inside <Shell>");
  return ctx;
}

export function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Sketch | null>(null);
  const [hasOpened, setHasOpened] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Legacy hash-route redirect: handles old share links like
  //   /#/read?p=<payload>, /#/compose, /#/gallery
  useEffect(() => {
    const raw = window.location.hash.replace(/^#/, "");
    if (!raw || raw === "/" || raw === "top") return;
    if (raw.startsWith("/read")) {
      const q = raw.split("?")[1] ?? "";
      router.replace(q ? `/read?${q}` : "/read");
      return;
    }
    if (raw.startsWith("/compose")) router.replace("/compose");
    else if (raw.startsWith("/gallery")) router.replace("/gallery");
  }, [router]);

  useEffect(() => {
    if (!shouldShowWelcomeModal(pathname)) return;
    const t = window.setTimeout(() => setShowWelcome(true), 500);
    return () => window.clearTimeout(t);
  }, [pathname]);

  const value: ContactModalCtx = {
    open: (sketch = null) => {
      setActive(sketch);
      setOpen(true);
      setHasOpened(true);
    },
  };

  return (
    <Ctx.Provider value={value}>
      <div className="paper-grain paper-vignette relative min-h-screen bg-paper text-ink flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
        {hasOpened && (
          <ContactModal
            open={open}
            sketch={active}
            onClose={() => setOpen(false)}
          />
        )}
        {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      </div>
    </Ctx.Provider>
  );
}
