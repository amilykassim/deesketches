"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RoughBox } from "../src/components/RoughBox";
import { Doodle } from "../src/components/Doodle";

const QUIPS = [
  "Looks like the ink spilled.",
  "A doodle ran off with the page.",
  "The paper crumpled mid-sketch.",
  "The cat sat on the keyboard.",
  "Chapter not found — the writer went for tea.",
];

function pickQuip(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return QUIPS[Math.abs(h) % QUIPS.length];
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log technical detail server-side via console so it shows up in Vercel logs.
    console.error("[error.tsx]", error);
  }, [error]);

  const quip = pickQuip(error.digest ?? error.message ?? "default");

  return (
    <main className="relative z-20 min-h-screen flex items-center justify-center px-5 py-24">
      <div className="text-center max-w-lg">
        <div className="flex justify-center gap-3 mb-6">
          <Doodle kind="squiggle" color="#FF8A3C" size={36} drift={4} />
          <Doodle kind="spark" color="#FF4D8D" size={32} drift={5} />
          <Doodle kind="star" color="#F6C667" size={32} drift={4} />
        </div>
        <div
          className="relative bg-paper p-8 mx-auto"
          style={{ transform: "rotate(-1deg)" }}
        >
          <RoughBox seed={77} strokeWidth={2} roughness={1.8} />
          <h1 className="font-display text-5xl mb-3">Oops.</h1>
          <p className="font-hand text-lg text-ink/75 mb-6">{quip}</p>
          <p className="font-ui text-sm text-ink/55 mb-8">
            Nothing's broken on your end. We'll go fish it out — try again in a
            moment.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="font-ui bg-ink text-paper px-6 py-2.5 rounded-full hover:bg-sketchPink pencil-cursor"
            >
              Try again
            </button>
            <Link
              href="/"
              className="font-ui border border-ink/25 px-6 py-2.5 rounded-full hover:bg-ink/5 pencil-cursor"
            >
              ← Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
