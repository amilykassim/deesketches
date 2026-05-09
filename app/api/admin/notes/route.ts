import { NextRequest, NextResponse } from "next/server";
import { listByStatus, NoteStatus } from "../../../../src/lib/notes/repo";
import {
  AdminAuthError,
  requireAdmin,
} from "../../../../src/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_STATUSES: NoteStatus[] = ["pending", "approved", "rejected"];

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
  } catch (e) {
    if (e instanceof AdminAuthError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    throw e;
  }
  const statusParam = req.nextUrl.searchParams.get("status");
  const status: NoteStatus =
    statusParam && (VALID_STATUSES as string[]).includes(statusParam)
      ? (statusParam as NoteStatus)
      : "pending";
  const notes = await listByStatus(status, 100);
  return NextResponse.json({
    items: notes.map((n) => ({
      id: n.id,
      sender: n.sender,
      recipient: n.recipient,
      email: n.email,
      category: n.category,
      format: n.format,
      cardIds: n.cardIds,
      chapters: n.chapters,
      createdAt: n.createdAt,
      key: n.key,
      status: n.status,
      rejectionReason: n.rejectionReason ?? null,
      openedAt: n.openedAt ?? null,
    })),
  });
}
