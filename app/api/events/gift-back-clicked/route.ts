import { NextResponse } from "next/server";
import { db, events } from "../../../../src/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { bookId?: unknown };
  try {
    body = (await req.json()) as { bookId?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (typeof body.bookId !== "string" || !body.bookId) {
    return NextResponse.json({ error: "Missing bookId" }, { status: 400 });
  }
  await db.insert(events).values({
    type: "gift_back_clicked",
    bookId: body.bookId,
  });
  return NextResponse.json({ ok: true });
}
