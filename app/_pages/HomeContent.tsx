"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Hero } from "../../src/components/Hero";
import { HowItWorks } from "../../src/components/HowItWorks";
import { Contact } from "../../src/components/Contact";
import { DrawnSquiggle } from "../../src/components/DrawnSquiggle";

const SectionSkeleton = () => <div className="py-28" aria-hidden />;

const LandingDemo = dynamic(
  () => import("../../src/components/LandingDemo").then((m) => m.LandingDemo),
  { loading: SectionSkeleton }
);

const Story = dynamic(
  () => import("../../src/components/Story").then((m) => m.Story),
  { loading: SectionSkeleton }
);

const Testimonials = dynamic(
  () =>
    import("../../src/components/Testimonials").then((m) => m.Testimonials),
  { loading: SectionSkeleton }
);

export default function HomeContent() {
  const router = useRouter();

  return (
    <main className="relative z-20">
      <Hero
        onBrowse={() => router.push("/gallery")}
        onCommission={() => router.push("/compose")}
      />
      <DrawnSquiggle color="#6FCF97" seed={4} className="max-w-4xl mx-auto" />
      <LandingDemo />
      <DrawnSquiggle color="#FF8A3C" seed={1} className="max-w-4xl mx-auto" />
      <HowItWorks />
      <DrawnSquiggle color="#FF4D8D" seed={0} className="max-w-4xl mx-auto" />
      <Story />
      <DrawnSquiggle color="#4A90E2" seed={2} className="max-w-4xl mx-auto" />
      <Testimonials />
      <DrawnSquiggle color="#F6C667" seed={3} className="max-w-4xl mx-auto" />
      <Contact />
    </main>
  );
}
