"use client";

import dynamic from "next/dynamic";

const HomeContent = dynamic(() => import("./_pages/HomeContent"), {
  ssr: false,
});

export default function HomePage() {
  return <HomeContent />;
}
