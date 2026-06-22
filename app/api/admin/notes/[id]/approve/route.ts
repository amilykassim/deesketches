import { NextResponse } from "next/server";
import { db, events } from "../../../../../../src/lib/db";
import { setStatus } from "../../../../../../src/lib/notes/repo";
import {
  AdminAuthError,
  requireAdmin,
} from "../../../../../../src/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin();
  } catch (e) {
    if (e instanceof AdminAuthError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    throw e;
  }
  const note = await setStatus(params.id, "approved");
  if (!note) {
    return NextResponse.json({ error: "Note not found or expired" }, { status: 404 });
  }

  try {
    await db.insert(events).values({
      type: "note_approved",
      bookId: note.id,
      metadata: {
        sender: note.sender,
        recipient: note.recipient,
        category: note.category,
      },
    });
  } catch (e) {
    console.error("[notes.approve] event log failed", e);
  }

  return NextResponse.json({ ok: true, status: note.status });
}
