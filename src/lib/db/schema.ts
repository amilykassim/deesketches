import {
  bigserial,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export type Chapter = { title: string; body: string };

export const audioClips = pgTable("audio_clips", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  mood: text("mood"),
  blobKey: text("blob_key").notNull(),
  blobUrl: text("blob_url").notNull(),
  durationSec: integer("duration_sec").notNull(),
  mimeType: text("mime_type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const books = pgTable(
  "books",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    k: text("k").notNull().unique(),
    format: text("format").notNull(),
    category: text("category").notNull(),
    cardIds: jsonb("card_ids").$type<string[]>().notNull(),
    sender: text("sender").notNull(),
    recipient: text("recipient").notNull(),
    storySource: text("story_source").notNull(),
    storyArcId: text("story_arc_id"),
    chapters: jsonb("chapters").$type<Chapter[]>().notNull(),
    audioClipId: uuid("audio_clip_id").references(() => audioClips.id, {
      onDelete: "restrict",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    createdAtIdx: index("books_created_at_idx").on(t.createdAt),
    categoryIdx: index("books_category_idx").on(t.category),
  }),
);

export const events = pgTable(
  "events",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    type: text("type").notNull(),
    bookId: uuid("book_id").references(() => books.id, { onDelete: "set null" }),
    audioClipId: uuid("audio_clip_id").references(() => audioClips.id, {
      onDelete: "set null",
    }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    typeCreatedIdx: index("events_type_created_idx").on(t.type, t.createdAt),
    bookIdx: index("events_book_idx").on(t.bookId),
  }),
);

export const adminSessions = pgTable(
  "admin_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tokenHash: text("token_hash").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => ({
    expiresIdx: index("admin_sessions_expires_idx").on(t.expiresAt),
  }),
);

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
export type Event = typeof events.$inferSelect;
export type AudioClip = typeof audioClips.$inferSelect;
export type AdminSession = typeof adminSessions.$inferSelect;

export const EVENT_TYPES = [
  "book_created",
  "book_opened",
  "book_completed",
  "gift_back_clicked",
  "magic_writer_used",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const STORY_SOURCES = ["self", "magic_writer", "legacy_arc"] as const;
export type StorySource = (typeof STORY_SOURCES)[number];
