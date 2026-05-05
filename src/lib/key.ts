import { adjectives, nouns } from "../data/wordlists";

export type SecretKey = {
  key: string;
  seed: number;
};

export function generateKey(): SecretKey {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 900) + 100;
  const key = `${adj}-${noun}-${num}`;
  return { key, seed: keyToSeed(key) };
}

export function keyToSeed(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function isValidKeyShape(key: string): boolean {
  return /^[A-Z]+-[A-Z]+-\d{3}$/.test(key.trim().toUpperCase());
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
