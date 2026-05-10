"use client";

import Link from "next/link";
import { RoughBox } from "../src/components/RoughBox";
import { Doodle } from "../src/components/Doodle";

export default function NotFound() {
  return (
    <main className="relative z-20 min-h-screen flex items-center justify-center px-5 py-24">
      <div className="text-center max-w-lg">
        <div className="flex justify-center gap-3 mb-6">
          <Doodle kind="dot" color="#4A90E2" size={20} drift={5} />
          <Doodle kind="heart" color="#FF4D8D" size={32} drift={4} />
          <Doodle kind="dot" color="#6FCF97" size={20} drift={5} />
        </div>
        <div
          className="relative bg-paper p-8 mx-auto"
          style={{ transform: "rotate(1deg)" }}
        >
          <RoughBox seed={404} strokeWidth={2} roughness={1.8} />
          <h1 className="font-display text-7xl mb-2">404</h1>
          <p className="font-hand text-xl text-ink/75 mb-6">
            This page wandered off with a doodle.
          </p>
          <p className="font-ui text-sm text-ink/55 mb-8">
            The link might be old, or we may have rearranged the studio.
          </p>
          <Link
            href="/"
            className="inline-block font-ui bg-ink text-paper px-6 py-2.5 rounded-full hover:bg-sketchPink pencil-cursor"
          >
            ← Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
