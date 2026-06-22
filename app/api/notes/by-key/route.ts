import { NextResponse } from "next/server";
import { db, events } from "../../../../src/lib/db";
import { getNoteByKey, markOpenedOnce } from "../../../../src/lib/notes/repo";
import { isReaderKeyShape } from "../../../../src/lib/key";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { k?: unknown };
  try {
    body = (await req.json()) as { k?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (typeof body.k !== "string" || !isReaderKeyShape(body.k)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  const note = await getNoteByKey(body.k);
  if (!note) {
    return NextResponse.json({ status: "not_found" });
  }
  if (note.status === "pending") {
    return NextResponse.json({
      status: "pending",
      sender: note.sender,
      recipient: note.recipient,
    });
  }
  if (note.status === "rejected") {
    return NextResponse.json({ status: "not_found" });
  }

  // Approved: log the first open.
  const isFirstOpen = await markOpenedOnce(note.id);
  if (isFirstOpen) {
    try {
      await db.insert(events).values({
        type: "book_opened",
        bookId: note.id,
        metadata: {
          sender: note.sender,
          recipient: note.recipient,
          category: note.category,
        },
      });
    } catch (e) {
      console.error("[notes.by-key] event log failed", e);
    }
  }

  return NextResponse.json({
    status: "approved",
    note: {
      id: note.id,
      format: note.format,
      category: note.category,
      cardIds: note.cardIds,
      sender: note.sender,
      recipient: note.recipient,
      storySource: note.storySource,
      storyArcId: note.storyArcId,
      chapters: note.chapters,
      createdAt: note.createdAt,
    },
  });
}
