"use client";

import dynamic from "next/dynamic";

const GalleryContent = dynamic(() => import("../_pages/GalleryContent"), {
  ssr: false,
});

export default function GalleryPage() {
  return <GalleryContent />;
}
