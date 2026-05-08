import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { timingSafeEqual } from "crypto";
import { db, books, audioClips } from "../../../../../src/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function constTimeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  let body: { k?: unknown };
  try {
    body = (await req.json()) as { k?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (typeof body.k !== "string" || !body.k) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  const [row] = await db
    .select({
      id: books.id,
      k: books.k,
      format: books.format,
      category: books.category,
      cardIds: books.cardIds,
      sender: books.sender,
      recipient: books.recipient,
      storySource: books.storySource,
      storyArcId: books.storyArcId,
      chapters: books.chapters,
      audioClipId: books.audioClipId,
      createdAt: books.createdAt,
    })
    .from(books)
    .where(eq(books.id, params.id))
    .limit(1);

  if (!row || !constTimeEqual(row.k, body.k.toLowerCase())) {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }

  let audio: { id: string; title: string; mood: string | null; url: string; durationSec: number } | null = null;
  if (row.audioClipId) {
    const [a] = await db
      .select()
      .from(audioClips)
      .where(eq(audioClips.id, row.audioClipId))
      .limit(1);
    if (a) {
      audio = {
        id: a.id,
        title: a.title,
        mood: a.mood,
        url: a.blobUrl,
        durationSec: a.durationSec,
      };
    }
  }

  return NextResponse.json({
    id: row.id,
    format: row.format,
    category: row.category,
    cardIds: row.cardIds,
    sender: row.sender,
    recipient: row.recipient,
    storySource: row.storySource,
    storyArcId: row.storyArcId,
    chapters: row.chapters,
    audio,
    createdAt: row.createdAt,
  });
}
