"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const ReadContent = dynamic(() => import("../_pages/ReadContent"), {
  ssr: false,
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ReadContent />
    </Suspense>
  );
}
