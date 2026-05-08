import { NextResponse } from "next/server";
import { db, books, events } from "../../../src/lib/db";
import type { Chapter, StorySource } from "../../../src/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  k?: unknown;
  format?: unknown;
  category?: unknown;
  cardIds?: unknown;
  sender?: unknown;
  recipient?: unknown;
  storySource?: unknown;
  storyArcId?: unknown;
  chapters?: unknown;
  audioClipId?: unknown;
};

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function isChapterArray(v: unknown): v is Chapter[] {
  return (
    Array.isArray(v) &&
    v.every(
      (c) =>
        c &&
        typeof c === "object" &&
        typeof (c as Chapter).title === "string" &&
        typeof (c as Chapter).body === "string",
    )
  );
}

const VALID_FORMATS = new Set(["digital", "physical"]);
const VALID_SOURCES = new Set(["self", "magic_writer", "legacy_arc"]);

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { k, format, category, sender, recipient, storySource, storyArcId, audioClipId } = body;

  if (typeof k !== "string" || !k) {
    return NextResponse.json({ error: "Missing k" }, { status: 400 });
  }
  if (typeof format !== "string" || !VALID_FORMATS.has(format)) {
    return NextResponse.json({ error: "Invalid format" }, { status: 400 });
  }
  if (typeof category !== "string" || !category) {
    return NextResponse.json({ error: "Missing category" }, { status: 400 });
  }
  if (!isStringArray(body.cardIds) || body.cardIds.length === 0) {
    return NextResponse.json({ error: "Invalid cardIds" }, { status: 400 });
  }
  if (typeof sender !== "string" || typeof recipient !== "string") {
    return NextResponse.json({ error: "Invalid sender/recipient" }, { status: 400 });
  }
  if (typeof storySource !== "string" || !VALID_SOURCES.has(storySource)) {
    return NextResponse.json({ error: "Invalid storySource" }, { status: 400 });
  }
  if (!isChapterArray(body.chapters)) {
    return NextResponse.json({ error: "Invalid chapters" }, { status: 400 });
  }
  if (audioClipId !== undefined && audioClipId !== null && typeof audioClipId !== "string") {
    return NextResponse.json({ error: "Invalid audioClipId" }, { status: 400 });
  }
  if (storyArcId !== undefined && storyArcId !== null && typeof storyArcId !== "string") {
    return NextResponse.json({ error: "Invalid storyArcId" }, { status: 400 });
  }

  try {
    const inserted = await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(books)
        .values({
          k: k.toLowerCase(),
          format,
          category,
          cardIds: body.cardIds as string[],
          sender,
          recipient,
          storySource: storySource as StorySource,
          storyArcId: (storyArcId as string | undefined) ?? null,
          chapters: body.chapters as Chapter[],
          audioClipId: (audioClipId as string | undefined) ?? null,
        })
        .returning({ id: books.id, k: books.k });

      await tx.insert(events).values({
        type: "book_created",
        bookId: row.id,
        metadata: { storySource, category, hasAudio: !!audioClipId },
      });

      if (storySource === "magic_writer") {
        await tx.insert(events).values({
          type: "magic_writer_used",
          bookId: row.id,
          metadata: { category },
        });
      }

      return row;
    });

    return NextResponse.json({ id: inserted.id, k: inserted.k }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg.includes("books_k_unique")) {
      return NextResponse.json({ error: "Key already in use" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}
