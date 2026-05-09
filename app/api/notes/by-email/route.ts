import { NextResponse } from "next/server";
import { listByEmail } from "../../../../src/lib/notes/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { email?: unknown };
  try {
    body = (await req.json()) as { email?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (typeof body.email !== "string" || !EMAIL_RE.test(body.email.trim())) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const notes = await listByEmail(body.email);
  return NextResponse.json({
    items: notes.map((n) => ({
      id: n.id,
      status: n.status,
      createdAt: n.createdAt,
      recipient: n.recipient,
      openedAt: n.openedAt ?? null,
      rejectionReason: n.rejectionReason ?? null,
    })),
  });
}
