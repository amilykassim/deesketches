import { Doodle } from "./Doodle";
import { RoughUnderline } from "./RoughUnderline";

export function Footer() {
  return (
    <footer className="relative border-t border-ink/10 py-10 px-5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="#top" className="inline-flex flex-col leading-none">
          <span className="font-display text-2xl text-ink">Andiko</span>
          <div className="w-20 mx-auto">
            <RoughUnderline color="#FF4D8D" thickness={2.5} />
          </div>
        </a>

        <div className="flex items-center gap-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="hover:rotate-6 transition-transform"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1a1a1a" strokeWidth="2">
              <rect x="4" y="4" width="20" height="20" rx="6" />
              <circle cx="14" cy="14" r="4.5" />
              <circle cx="20" cy="8" r="1.2" fill="#1a1a1a" />
            </svg>
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok"
            className="hover:-rotate-6 transition-transform"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1a1a1a" strokeWidth="2">
              <path d="M16 5 L16 18 a4 4 0 1 1 -4 -4" strokeLinecap="round" />
              <path d="M16 5 q1 4 5 5" strokeLinecap="round" />
            </svg>
          </a>
          <a
            href="mailto:hello@andiko.studio"
            aria-label="Email"
            className="hover:rotate-6 transition-transform"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1a1a1a" strokeWidth="2">
              <rect x="4" y="6" width="20" height="16" rx="2" />
              <path d="M4 8 L14 16 L24 8" strokeLinecap="round" />
            </svg>
          </a>
        </div>

        <p className="font-ui text-xs text-ink/55 text-center md:text-right flex items-center gap-2">
          Made with
          <Doodle kind="heart" color="#FF4D8D" size={16} />
          <a
            href="http://velstays.com/"
            target="_blank"
            rel="noreferrer"
            className="text-ink underline decoration-sketchPink decoration-2 underline-offset-4 hover:text-sketchPink transition-colors pencil-cursor"
          >
            By Velstays
          </a>
          <span className="opacity-60">· © {new Date().getFullYear()}</span>
        </p>
      </div>
    </footer>
  );
}
