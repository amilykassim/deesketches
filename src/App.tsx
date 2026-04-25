import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Story } from "./components/Story";
import { Gallery } from "./components/Gallery";
import { HowItWorks } from "./components/HowItWorks";
import { Testimonials } from "./components/Testimonials";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { ContactModal } from "./components/ContactModal";
import type { Sketch } from "./data/sketches";

function App() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Sketch | null>(null);

  const openWith = (s: Sketch | null) => {
    setActive(s);
    setOpen(true);
  };

  const browse = () => {
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="paper-grain paper-vignette relative min-h-screen bg-paper text-ink">
      <Navbar onCommission={() => openWith(null)} />

      <main className="relative z-20">
        <Hero onBrowse={browse} onCommission={() => openWith(null)} />
        <Story />
        <Gallery onPick={(s) => openWith(s)} />
        <HowItWorks />
        <Testimonials />
        <Contact />
      </main>

      <Footer />

      <ContactModal open={open} sketch={active} onClose={() => setOpen(false)} />
    </div>
  );
}

export default App;
