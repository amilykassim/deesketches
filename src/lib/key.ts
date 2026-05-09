export function keyToSeed(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const KEY_MIN_LENGTH = 6;
export const KEY_MAX_LENGTH = 64;

export function isValidKeyShape(key: string): boolean {
  const t = key.trim();
  return t.length >= KEY_MIN_LENGTH && t.length <= KEY_MAX_LENGTH;
}

/** Loose key shape used by the reader: lets us accept anything plausible
 * before hitting the lookup endpoint. The server is the actual gate. */
export function isReaderKeyShape(key: string): boolean {
  const t = key.trim();
  return t.length >= 1 && t.length <= KEY_MAX_LENGTH;
}

/** Mulberry32 — small deterministic PRNG seeded from the key. */
export function rngFromSeed(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Auto-generated keys ────────────────────────────────────────────────────
// Two-word "<adjective>-<noun>" keys are short, easy to dictate over
// WhatsApp, and family-friendly. ~30×30 = 900 base combos; on collision the
// caller retries with a 2-digit suffix for ~90,000 combos. Plenty for the
// 7-day-TTL volume this app will ever see.

const ADJECTIVES = [
  "happy",
  "sunny",
  "brave",
  "kind",
  "calm",
  "swift",
  "bright",
  "gentle",
  "lucky",
  "jolly",
  "cosy",
  "breezy",
  "fluffy",
  "golden",
  "merry",
  "nimble",
  "peppy",
  "shiny",
  "snappy",
  "tender",
  "witty",
  "zesty",
  "mellow",
  "plucky",
  "quirky",
  "rosy",
  "silly",
  "smart",
  "sweet",
  "warm",
];

const NOUNS = [
  "otter",
  "panda",
  "fox",
  "bear",
  "owl",
  "koala",
  "robin",
  "finch",
  "hare",
  "lynx",
  "wolf",
  "mole",
  "seal",
  "deer",
  "swan",
  "dove",
  "frog",
  "moth",
  "bee",
  "cat",
  "bunny",
  "duck",
  "goat",
  "mouse",
  "badger",
  "turtle",
  "crab",
  "lamb",
  "puppy",
  "wren",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a short, memorable key. Default is `<adjective>-<noun>`. Pass
 * `withSuffix: true` (used on collision retry) to append a 2-digit number.
 */
export function generateKey(opts?: { withSuffix?: boolean }): string {
  const base = `${randomFrom(ADJECTIVES)}-${randomFrom(NOUNS)}`;
  if (!opts?.withSuffix) return base;
  const n = 10 + Math.floor(Math.random() * 90);
  return `${base}-${n}`;
}
