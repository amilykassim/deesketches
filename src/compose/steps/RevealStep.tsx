import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Payload } from "../../lib/payload";
import { buildShareUrl } from "../../lib/payload";
import { RoughBox } from "../../components/RoughBox";
import { Doodle } from "../../components/Doodle";
import { ConfettiBurst } from "../../components/ConfettiBurst";

type Props = {
  payload: Payload;
  secretKey: string;
};

export function RevealStep({ payload, secretKey }: Props) {
  const [confettiKey, setConfettiKey] = useState(0);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const url = buildShareUrl(payload);

  useEffect(() => {
    setConfettiKey((k) => k + 1);
  }, []);

  const copy = async (text: string, set: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      set(true);
      setTimeout(() => set(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <section className="text-center">
      <ConfettiBurst trigger={confettiKey} />
      <div className="flex justify-center gap-3 mb-4">
        <Doodle kind="star" color="#F6C667" size={24} drift={3.5} />
        <Doodle kind="heart" color="#FF4D8D" size={24} drift={4} />
        <Doodle kind="spark" color="#4A90E2" size={24} drift={3} />
      </div>
      <h1 className="font-display text-5xl mb-2">It's ready.</h1>
      <p className="font-hand text-lg text-ink/70 mb-10">
        Share the secret key (or the link) with {payload.recipient}.
      </p>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="relative bg-paper p-8 mx-auto max-w-xl"
        style={{ transform: "rotate(-1deg)" }}
      >
        <RoughBox seed={101} roughness={1.9} strokeWidth={1.8} />
        <div className="font-ui text-xs uppercase tracking-wider text-ink/55 mb-2">
          Secret key
        </div>
        <div className="font-display text-5xl text-ink tracking-wide select-all break-all">
          {secretKey}
        </div>
        <button
          type="button"
          onClick={() => copy(secretKey, setCopiedKey)}
          className="font-ui text-sm text-ink/60 hover:text-sketchPink mt-4 pencil-cursor"
        >
          {copiedKey ? "✓ copied" : "Copy key"}
        </button>
      </motion.div>

      <div className="mt-8 max-w-2xl mx-auto">
        <div className="font-ui text-xs uppercase tracking-wider text-ink/55 mb-2">
          Or send the link
        </div>
        <div className="bg-paper border border-ink/15 px-4 py-3 rounded-sm font-ui text-sm text-ink/80 break-all">
          {url}
        </div>
        <div className="flex gap-3 justify-center mt-4">
          <button
            type="button"
            onClick={() => copy(url, setCopiedLink)}
            className="font-ui bg-ink text-paper px-5 py-2 rounded-full hover:bg-sketchPink pencil-cursor transition-colors"
          >
            {copiedLink ? "✓ copied" : "Copy link"}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-ui border border-ink/30 px-5 py-2 rounded-full hover:bg-ink/5 pencil-cursor transition-colors"
          >
            Preview as recipient ↗
          </a>
        </div>
      </div>

      <p className="font-hand text-sm text-ink/55 mt-10">
        Heads up — the link carries the whole story. The key alone won't unlock
        on a different device, so share both, or share the link.
      </p>
    </section>
  );
}
