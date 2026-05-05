import type { Category } from "../data/sketches";

export type CardFormat = "digital" | "physical";

export type Payload = {
  v: 1;
  k: string;
  format: CardFormat;
  category: Category;
  cardIds: string[];
  sender: string;
  recipient: string;
  createdAt: number;
};

function toBase64Url(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): string {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function encodePayload(p: Payload): string {
  return toBase64Url(JSON.stringify(p));
}

export function decodePayload(s: string): Payload | null {
  try {
    const obj = JSON.parse(fromBase64Url(s));
    if (!obj || obj.v !== 1) return null;
    return obj as Payload;
  } catch {
    return null;
  }
}

export function buildShareUrl(payload: Payload): string {
  const enc = encodePayload(payload);
  const base = window.location.origin + window.location.pathname;
  return `${base}#/read?p=${enc}`;
}
