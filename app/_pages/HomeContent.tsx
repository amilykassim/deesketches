"use client";

import { useRouter } from "next/navigation";
import { Hero } from "../../src/components/Hero";
import { LandingDemo } from "../../src/components/LandingDemo";
import { HowItWorks } from "../../src/components/HowItWorks";
import { Story } from "../../src/components/Story";
import { Testimonials } from "../../src/components/Testimonials";
import { Contact } from "../../src/components/Contact";
import { DrawnSquiggle } from "../../src/components/DrawnSquiggle";
import { useContactModal } from "../shell";

export default function HomeContent() {
  const router = useRouter();
  const modal = useContactModal();

  return (
    <main className="relative z-20">
      <Hero
        onBrowse={() => router.push("/gallery")}
        onCommission={() => modal.open(null)}
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
