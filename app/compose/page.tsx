"use client";

import dynamic from "next/dynamic";

const ComposePage = dynamic(
  () => import("../../src/compose/ComposePage").then((m) => m.ComposePage),
  { ssr: false }
);

export default function Page() {
  return <ComposePage />;
}
