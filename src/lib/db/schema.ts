import {
  bigserial,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export type Chapter = { title: string; body: string };

/**
 * Append-only analytics log. Surrives note expiry (notes themselves live in
 * Redis with a 7-day TTL). Each event stamps its own context into `metadata`
 * so we don't need to join back to the (gone) books table.
 *
 * `bookId` was named when notes lived in Postgres; it now stores the Redis
 * note id (UUID) as an opaque correlation key, no FK.
 */
export const events = pgTable(
  "events",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    type: text("type").notNull(),
    bookId: uuid("book_id"),
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

export type Event = typeof events.$inferSelect;
export type AdminSession = typeof adminSessions.$inferSelect;

export const EVENT_TYPES = [
  "book_created",
  "book_opened",
  "book_completed",
  "gift_back_clicked",
  "magic_writer_used",
  "note_approved",
  "note_rejected",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const STORY_SOURCES = ["self", "magic_writer", "legacy_arc"] as const;
export type StorySource = (typeof STORY_SOURCES)[number];

export type EventMeta = {
  sender?: string;
  recipient?: string;
  category?: string;
  storySource?: StorySource;
  hasEmail?: boolean;
  rejectionReason?: string;
};
