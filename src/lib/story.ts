import { arcsForCategory } from "../data/stories";
import type { Category } from "../data/sketches";
import { keyToSeed, rngFromSeed } from "./key";

export type FrozenChapter = { title: string; body: string };

export type FrozenStory = {
  arcId: string;
  arcTitle: string;
  chapters: FrozenChapter[];
};

export function pickStoryFromKey(
  category: Category,
  k: string,
  count: number,
): FrozenStory | null {
  const candidates = arcsForCategory(category);
  if (candidates.length === 0) return null;
  const seed = keyToSeed(k);
  const rng = rngFromSeed(seed);
  const arcIdx = Math.floor(rng() * candidates.length);
  const arc = candidates[arcIdx];
  if (!arc) return null;
  const chapters: FrozenChapter[] = arc.chapters
    .slice(0, count)
    .map((c) => ({ title: c.title, body: c.body }));
  return { arcId: arc.id, arcTitle: arc.title, chapters };
}
