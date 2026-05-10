import { NextResponse } from "next/server";
import { db, events } from "../../../../../../src/lib/db";
import { setStatus } from "../../../../../../src/lib/notes/repo";
import { sendRejected } from "../../../../../../src/lib/email";
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
  let body: { reason?: unknown } = {};
  try {
    body = (await req.json()) as { reason?: unknown };
  } catch {
    // empty body acceptable
  }
  const reason = typeof body.reason === "string" ? body.reason.slice(0, 500) : undefined;

  const note = await setStatus(params.id, "rejected", reason);
  if (!note) {
    return NextResponse.json({ error: "Note not found or expired" }, { status: 404 });
  }

  try {
    await db.insert(events).values({
      type: "note_rejected",
      bookId: note.id,
      metadata: {
        sender: note.sender,
        recipient: note.recipient,
        category: note.category,
        rejectionReason: reason,
      },
    });
  } catch (e) {
    console.error("[notes.reject] event log failed", e);
  }
  if (note.email) {
    await sendRejected({
      to: note.email,
      recipient: note.recipient,
      reason,
    });
  }

  return NextResponse.json({ ok: true, status: note.status });
}
