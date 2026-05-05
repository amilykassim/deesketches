import { useMemo, useState } from "react";
import { decodePayload } from "../lib/payload";
import { keyToSeed, rngFromSeed } from "../lib/key";
import { arcsForCategory } from "../data/stories";
import { sketches } from "../data/sketches";
import { KeyEntryStep } from "./KeyEntryStep";
import { StoryReader } from "./StoryReader";

type Props = {
  payload?: string;
};

export function ReadPage({ payload }: Props) {
  const [showReader, setShowReader] = useState(!!payload);

  const decoded = useMemo(() => {
    if (!payload) return null;
    return decodePayload(payload);
  }, [payload]);

  const reading = useMemo(() => {
    if (!decoded) return null;
    const seed = keyToSeed(decoded.k);
    const rng = rngFromSeed(seed);
    const candidates = arcsForCategory(decoded.category);
    const arcIdx = Math.floor(rng() * candidates.length);
    const arc = candidates[arcIdx];
    if (!arc) return null;
    const chapters = arc.chapters.slice(0, decoded.cardIds.length);
    const pairs = decoded.cardIds.map((id, i) => ({
      sketch: sketches.find((s) => s.id === id),
      chapter: chapters[i],
    }));
    return { arc, pairs, decoded };
  }, [decoded]);

  if (!showReader || !reading) {
    return (
      <main className="relative z-20 pt-28 pb-32 min-h-screen">
        <div className="max-w-2xl mx-auto px-5">
          <KeyEntryStep
            hasPayload={!!payload}
            decoded={decoded}
            onUnlock={() => setShowReader(true)}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-20 min-h-screen">
      <StoryReader
        title={reading.arc.title}
        sender={reading.decoded.sender}
        recipient={reading.decoded.recipient}
        secretKey={reading.decoded.k}
        pairs={reading.pairs}
      />
    </main>
  );
}
