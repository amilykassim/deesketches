// Drops the foreign-key constraints that were defined when the books and
// audio_clips tables were authoritative. After the Redis→Blob migration
// notes live outside Postgres, so events.book_id is now an opaque UUID
// that doesn't reference any Postgres row.
//
// The Drizzle schema already removed these references, but the live DB
// schema still enforces them until this runs. This script only drops the
// FK constraints — it doesn't drop the (now-empty) books/audio_clips tables.
//
// Run with:
//   node --env-file=.env scripts/drop-legacy-fks.cjs

const { Pool, neonConfig } = require("@neondatabase/serverless");
const ws = require("ws");

neonConfig.webSocketConstructor = ws;

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url) {
  console.error("DATABASE_URL (or POSTGRES_URL) is not set");
  process.exit(1);
}

const STATEMENTS = [
  "ALTER TABLE events DROP CONSTRAINT IF EXISTS events_book_id_books_id_fk",
  "ALTER TABLE events DROP CONSTRAINT IF EXISTS events_audio_clip_id_audio_clips_id_fk",
  "ALTER TABLE books DROP CONSTRAINT IF EXISTS books_audio_clip_id_audio_clips_id_fk",
];

(async () => {
  const pool = new Pool({ connectionString: url });
  try {
    for (const stmt of STATEMENTS) {
      process.stdout.write(`> ${stmt}\n`);
      await pool.query(stmt);
      process.stdout.write("  ok\n");
    }
    process.stdout.write("Done.\n");
  } catch (e) {
    console.error("Migration failed:", e);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
