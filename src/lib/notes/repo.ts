import { randomUUID } from "crypto";
import { getStorage } from "../storage";

export const NOTE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export type NoteStatus = "pending" | "approved" | "rejected";
export type StorySource = "self" | "magic_writer";

export type NoteRecord = {
  id: string;
  status: NoteStatus;
  key: string;
  format: "digital" | "physical";
  category: string;
  cardIds: string[];
  sender: string;
  recipient: string;
  email: string;
  storySource: StorySource;
  storyArcId: string | null;
  chapters: { title: string; body: string }[];
  createdAt: number;
  openedAt?: number;
  rejectionReason?: string;
};

// ── Path helpers ───────────────────────────────────────────────────────────
// Pass prefixes WITHOUT trailing slash to `storage.list()`. The filesystem
// driver concatenates `${prefix}/${name}` and a trailing slash there
// produces `prefix//name`, breaking downstream key matching.

const notePath = (id: string) => `notes/${id}.json`;
const keyPath = (k: string) => `keys/${k.toLowerCase()}.txt`;
const emailPrefix = (email: string) => `emails/${email.trim().toLowerCase()}`;
const emailIndexPath = (email: string, createdAt: number, id: string) =>
  `${emailPrefix(email)}/${new Date(createdAt).toISOString()}-${id}.json`;

const JSON_TYPE = { contentType: "application/json" } as const;
const TEXT_TYPE = { contentType: "text/plain" } as const;

// ── Serialization ──────────────────────────────────────────────────────────

function bufFromString(s: string): Buffer {
  return Buffer.from(s, "utf8");
}

function bufFromJson(o: unknown): Buffer {
  return bufFromString(JSON.stringify(o));
}

function bufToString(buf: Buffer | null): string | null {
  return buf ? buf.toString("utf8") : null;
}

function bufToJson<T>(buf: Buffer | null): T | null {
  const s = bufToString(buf);
  if (!s) return null;
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

// ── Public API ─────────────────────────────────────────────────────────────

export async function isKeyAvailable(k: string): Promise<boolean> {
  const storage = getStorage();
  const existing = await storage.get(keyPath(k));
  return existing === null;
}

export async function createNote(input: {
  key: string;
  format: "digital" | "physical";
  category: string;
  cardIds: string[];
  sender: string;
  recipient: string;
  email: string;
  storySource: StorySource;
  storyArcId: string | null;
  chapters: { title: string; body: string }[];
}): Promise<{ id: string } | { error: "key_taken" }> {
  const storage = getStorage();
  const k = input.key.toLowerCase();

  // HEAD-check key availability. Tiny race window remains; acceptable given
  // the approval gate is the actual security boundary.
  const existing = await storage.get(keyPath(k));
  if (existing !== null) return { error: "key_taken" };

  const id = randomUUID();
  const now = Date.now();
  const note: NoteRecord = {
    id,
    status: "pending",
    key: input.key,
    format: input.format,
    category: input.category,
    cardIds: input.cardIds,
    sender: input.sender,
    recipient: input.recipient,
    email: input.email.trim().toLowerCase(),
    storySource: input.storySource,
    storyArcId: input.storyArcId,
    chapters: input.chapters,
    createdAt: now,
  };

  await Promise.all([
    storage.put(notePath(id), bufFromJson(note), JSON_TYPE),
    storage.put(keyPath(k), bufFromString(id), TEXT_TYPE),
    storage.put(
      emailIndexPath(note.email, now, id),
      bufFromJson({ noteId: id }),
      JSON_TYPE,
    ),
  ]);

  return { id };
}

export async function getNoteById(id: string): Promise<NoteRecord | null> {
  const storage = getStorage();
  const buf = await storage.get(notePath(id));
  const note = bufToJson<NoteRecord>(buf);
  if (!note) return null;

  // Lazy TTL: expired notes self-delete on read.
  if (note.createdAt + NOTE_TTL_MS < Date.now()) {
    await cascadeDelete(note).catch(() => {
      // best effort
    });
    return null;
  }
  return note;
}

export async function getNoteByKey(k: string): Promise<NoteRecord | null> {
  const storage = getStorage();
  const idBuf = await storage.get(keyPath(k));
  const id = bufToString(idBuf);
  if (!id) return null;
  return getNoteById(id);
}

export async function listByEmail(email: string): Promise<NoteRecord[]> {
  const storage = getStorage();
  const entries = await storage.list(emailPrefix(email));
  if (entries.length === 0) return [];

  // Filenames are ISO-prefixed → already chronological. Reverse for newest-first.
  const sorted = [...entries].sort((a, b) => (a.key < b.key ? 1 : -1));
  const notes = await Promise.all(
    sorted.map(async (entry) => {
      const idxBuf = await storage.get(entry.key);
      const idx = bufToJson<{ noteId: string }>(idxBuf);
      if (!idx?.noteId) return null;
      return getNoteById(idx.noteId);
    }),
  );
  return notes.filter((n): n is NoteRecord => n !== null);
}

export async function listPending(limit = 100): Promise<NoteRecord[]> {
  return listByStatus("pending", limit);
}

export async function listAll(opts?: {
  page?: number;
  pageSize?: number;
}): Promise<{ items: NoteRecord[]; total: number }> {
  const storage = getStorage();
  const entries = await storage.list("notes");
  if (entries.length === 0) return { items: [], total: 0 };

  const notes = await Promise.all(
    entries.map(async (entry) => {
      const buf = await storage.get(entry.key);
      const note = bufToJson<NoteRecord>(buf);
      if (!note) return null;
      if (note.createdAt + NOTE_TTL_MS < Date.now()) return null;
      return note;
    }),
  );

  const live = notes
    .filter((n): n is NoteRecord => n !== null)
    .sort((a, b) => b.createdAt - a.createdAt); // newest first

  const total = live.length;
  const page = Math.max(1, opts?.page ?? 1);
  const pageSize = Math.max(1, Math.min(500, opts?.pageSize ?? 100));
  const start = (page - 1) * pageSize;
  return { items: live.slice(start, start + pageSize), total };
}

export async function listByStatus(
  status: NoteStatus,
  limit = 100,
): Promise<NoteRecord[]> {
  const storage = getStorage();
  const entries = await storage.list("notes");
  if (entries.length === 0) return [];

  const notes = await Promise.all(
    entries.map(async (entry) => {
      const buf = await storage.get(entry.key);
      const note = bufToJson<NoteRecord>(buf);
      if (!note) return null;
      // Lazy TTL applies here too — no point surfacing expired notes.
      if (note.createdAt + NOTE_TTL_MS < Date.now()) return null;
      return note;
    }),
  );

  const filtered = notes
    .filter((n): n is NoteRecord => n !== null)
    .filter((n) => n.status === status);

  // Pending: oldest-first (work queue). Approved/rejected: newest-first.
  filtered.sort((a, b) =>
    status === "pending" ? a.createdAt - b.createdAt : b.createdAt - a.createdAt,
  );
  return filtered.slice(0, limit);
}

export async function setStatus(
  id: string,
  status: NoteStatus,
  reason?: string,
): Promise<NoteRecord | null> {
  const storage = getStorage();
  const note = await getNoteById(id);
  if (!note) return null;

  const next: NoteRecord = {
    ...note,
    status,
    ...(reason ? { rejectionReason: reason } : {}),
  };
  await storage.put(notePath(id), bufFromJson(next), JSON_TYPE);
  return next;
}

/**
 * Read-modify-write set of `openedAt`. Returns true if this call was the one
 * that set the field (i.e. should fire the opened email). Race window is
 * tolerable: at worst, two same-millisecond opens fire two emails.
 */
export async function markOpenedOnce(id: string): Promise<boolean> {
  const storage = getStorage();
  const note = await getNoteById(id);
  if (!note) return false;
  if (note.openedAt) return false;
  const next: NoteRecord = { ...note, openedAt: Date.now() };
  await storage.put(notePath(id), bufFromJson(next), JSON_TYPE);
  return true;
}

/**
 * Manually triggered (admin) sweep. Walks the `notes/` prefix, deletes any
 * note whose 7-day TTL has elapsed, plus its key/email/pending markers.
 */
export async function cleanupExpired(): Promise<{ deleted: number }> {
  const storage = getStorage();
  const entries = await storage.list("notes");
  if (entries.length === 0) return { deleted: 0 };

  const now = Date.now();
  let deleted = 0;
  await Promise.all(
    entries.map(async (entry) => {
      const buf = await storage.get(entry.key);
      const note = bufToJson<NoteRecord>(buf);
      if (!note) return;
      if (note.createdAt + NOTE_TTL_MS >= now) return;
      await cascadeDelete(note);
      deleted += 1;
    }),
  );
  return { deleted };
}

async function cascadeDelete(note: NoteRecord): Promise<void> {
  const storage = getStorage();
  await Promise.all([
    storage.delete(notePath(note.id)),
    storage.delete(keyPath(note.key)),
    storage.delete(emailIndexPath(note.email, note.createdAt, note.id)),
  ]);
}

export async function deleteNote(id: string): Promise<boolean> {
  const note = await getNoteById(id);
  if (!note) return false;
  await cascadeDelete(note);
  return true;
}

export async function deleteAllNotes(): Promise<{ deleted: number }> {
  const storage = getStorage();
  const entries = await storage.list("notes");
  if (entries.length === 0) return { deleted: 0 };

  let deleted = 0;
  await Promise.all(
    entries.map(async (entry) => {
      const buf = await storage.get(entry.key);
      const note = bufToJson<NoteRecord>(buf);
      if (!note) {
        await storage.delete(entry.key).catch(() => {});
        return;
      }
      await cascadeDelete(note);
      deleted += 1;
    }),
  );
  return { deleted };
}
