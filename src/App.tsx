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
import { DrawnSquiggle } from "./components/DrawnSquiggle";
import type { Sketch } from "./data/sketches";
import { useRoute } from "./lib/router";
import { ComposePage } from "./compose/ComposePage";
import { ReadPage } from "./read/ReadPage";

function App() {
  const route = useRoute();
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

      {route.name === "home" && (
        <main className="relative z-20">
          <Hero onBrowse={browse} onCommission={() => openWith(null)} />
          <DrawnSquiggle color="#FF4D8D" seed={0} className="max-w-4xl mx-auto" />
          <Story />
          <DrawnSquiggle color="#FF8A3C" seed={1} className="max-w-4xl mx-auto" />
          <Gallery onPick={(s) => openWith(s)} />
          <HowItWorks />
          <DrawnSquiggle color="#4A90E2" seed={2} className="max-w-4xl mx-auto" />
          <Testimonials />
          <DrawnSquiggle color="#F6C667" seed={3} className="max-w-4xl mx-auto" />
          <Contact />
        </main>
      )}

      {route.name === "compose" && <ComposePage />}
      {route.name === "read" && <ReadPage payload={route.payload} />}

      <Footer />

      <ContactModal open={open} sketch={active} onClose={() => setOpen(false)} />
    </div>
  );
}

export default App;
