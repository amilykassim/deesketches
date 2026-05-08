"use client";

import { Gallery } from "../../src/components/Gallery";
import { useContactModal } from "../shell";

export default function GalleryContent() {
  const modal = useContactModal();
  return (
    <main className="relative z-20">
      <Gallery onPick={(s) => modal.open(s)} />
    </main>
  );
}
