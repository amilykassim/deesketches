"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { RoughUnderline } from "./RoughUnderline";
// TEMP — remove when email testing is done.
import { TempEmailTestButton } from "./TempEmailTestButton";

const navLinks = [
  { href: "/compose", label: "Send a note book" },
  { href: "/read", label: "I have a key" },
  { href: "/gallery", label: "Gallery" },
  { href: "/my-notes", label: "My notes" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while mobile menu is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <header
      className={`nav-bar fixed top-0 inset-x-0 z-30 transition-all duration-300 ${
        scrolled ? "nav-bar--scrolled" : ""
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
        <Link href="/" className="relative inline-flex flex-col leading-none">
          <span className="font-display text-3xl text-ink">Andiko</span>
          <div className="w-24 mx-auto">
            <RoughUnderline color="#FF4D8D" thickness={3} />
          </div>
        </Link>
        <div className="hidden sm:flex items-center gap-7 font-ui text-ink/85">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`transition-colors ${
                  active ? "text-sketchPink" : "hover:text-sketchPink"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          {/* TEMP — remove when email testing is done. */}
          <TempEmailTestButton />
          <Link
            href="/compose"
            className="hidden sm:inline-flex font-ui text-sm bg-ink text-paper px-4 py-2 rounded-full hover:bg-sketchPink transition-colors pencil-cursor"
          >
            Get one for only 2000 Rwf
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-ink/25 text-ink hover:bg-ink/5 pencil-cursor"
          >
            <Burger open={menuOpen} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden absolute top-full inset-x-0 bg-paper border-t border-ink/10 shadow-lg"
          >
            <div className="max-w-6xl mx-auto px-5 py-5 flex flex-col gap-1 font-ui">
              {navLinks.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`block px-3 py-3 rounded ${
                      active
                        ? "text-sketchPink bg-ink/5"
                        : "text-ink hover:bg-ink/5"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
              <Link
                href="/compose"
                className="mt-3 inline-flex items-center justify-center font-ui text-sm bg-ink text-paper px-4 py-3 rounded-full hover:bg-sketchPink transition-colors pencil-cursor"
              >
                Get one for only 2000 Rwf
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Burger({ open }: { open: boolean }) {
  return (
    <span className="relative block w-5 h-4">
      <span
        className="absolute left-0 right-0 h-[2px] bg-ink rounded transition-all duration-200"
        style={{
          top: open ? "50%" : 0,
          transform: open ? "translateY(-50%) rotate(45deg)" : "none",
        }}
      />
      <span
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-ink rounded transition-opacity duration-200"
        style={{ opacity: open ? 0 : 1 }}
      />
      <span
        className="absolute left-0 right-0 h-[2px] bg-ink rounded transition-all duration-200"
        style={{
          bottom: open ? "50%" : 0,
          transform: open ? "translateY(50%) rotate(-45deg)" : "none",
        }}
      />
    </span>
  );
}
