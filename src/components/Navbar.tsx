import { useEffect, useState } from "react";
import { RoughUnderline } from "./RoughUnderline";

type Props = {
  onCommission: () => void;
};

export function Navbar({ onCommission }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-30 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(251,247,240,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(6px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(26,26,26,0.08)" : "none",
      }}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
        <a href="#top" className="relative inline-flex flex-col leading-none">
          <span className="font-display text-3xl text-ink">Tinnynotes</span>
          <RoughUnderline color="#FF4D8D" thickness={3} />
        </a>
        <div className="hidden sm:flex items-center gap-7 font-ui text-ink/85">
          <a href="#/" className="hover:text-sketchPink transition-colors">
            Home
          </a>
          <a href="#/compose" className="hover:text-sketchPink transition-colors">
            Send a card
          </a>
          <a href="#/read" className="hover:text-sketchPink transition-colors">
            I have a key
          </a>
          <a href="#/gallery" className="hover:text-sketchPink transition-colors">
            Gallery
          </a>
          <a href="#contact" className="hover:text-sketchPink transition-colors">
            Contact
          </a>
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
