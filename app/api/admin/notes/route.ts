import { NextRequest, NextResponse } from "next/server";
import { listAll } from "../../../../src/lib/notes/repo";
import {
  AdminAuthError,
  requireAdmin,
} from "../../../../src/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
  } catch (e) {
    if (e instanceof AdminAuthError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    throw e;
  }
  const url = req.nextUrl;
  const page = parseInt(url.searchParams.get("page") ?? "1", 10) || 1;
  const pageSize =
    parseInt(url.searchParams.get("pageSize") ?? "100", 10) || 100;
  const { items, total } = await listAll({ page, pageSize });
  return NextResponse.json({
    page,
    pageSize,
    total,
    items: items.map((n) => ({
      id: n.id,
      sender: n.sender,
      recipient: n.recipient,
      email: n.email ?? "",
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
