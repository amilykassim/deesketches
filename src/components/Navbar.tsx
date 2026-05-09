"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RoughUnderline } from "./RoughUnderline";

type Props = {
  onCommission: () => void;
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/compose", label: "Send a card" },
  { href: "/read", label: "I have a key" },
  { href: "/gallery", label: "Gallery" },
];

export function Navbar({ onCommission }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <Link href="/#contact" className="hover:text-sketchPink transition-colors">
            Contact
          </Link>
        </div>
        <button
          type="button"
          onClick={onCommission}
          className="font-ui text-sm bg-ink text-paper px-4 py-2 rounded-full hover:bg-sketchPink transition-colors pencil-cursor"
        >
          Get one for only 2k RWF
        </button>
      </nav>
    </header>
  );
}
