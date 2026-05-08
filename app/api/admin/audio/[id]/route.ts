import { NextResponse } from "next/server";
import { eq, and, isNotNull } from "drizzle-orm";
import { db, audioClips, books } from "../../../../../src/lib/db";
import { getStorage } from "../../../../../src/lib/storage";
import {
  AdminAuthError,
  requireAdmin,
} from "../../../../../src/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function gate(): Promise<NextResponse | null> {
  try {
    await requireAdmin();
    return null;
  } catch (e) {
    if (e instanceof AdminAuthError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    throw e;
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const denied = await gate();
  if (denied) return denied;

  let body: { title?: unknown; mood?: unknown };
  try {
    body = (await req.json()) as { title?: unknown; mood?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const update: { title?: string; mood?: string | null } = {};
  if (typeof body.title === "string" && body.title.trim()) {
    update.title = body.title.trim();
  }
  if ("mood" in body) {
    if (body.mood === null || body.mood === "") update.mood = null;
    else if (typeof body.mood === "string") update.mood = body.mood.trim();
    else
      return NextResponse.json({ error: "Invalid mood" }, { status: 400 });
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const [row] = await db
    .update(audioClips)
    .set(update)
    .where(eq(audioClips.id, params.id))
    .returning();
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ clip: row });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const denied = await gate();
  if (denied) return denied;

  const referencing = await db
    .select({ id: books.id, recipient: books.recipient, sender: books.sender, createdAt: books.createdAt })
    .from(books)
    .where(and(eq(books.audioClipId, params.id), isNotNull(books.audioClipId)))
    .limit(50);

  if (referencing.length > 0) {
    return NextResponse.json(
      {
        error: "Clip is in use by existing books",
        referencingBooks: referencing,
      },
      { status: 409 },
    );
  }

  const [row] = await db
    .select()
    .from(audioClips)
    .where(eq(audioClips.id, params.id))
    .limit(1);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.delete(audioClips).where(eq(audioClips.id, params.id));
  try {
    await getStorage().delete(row.blobKey);
  } catch {
    // best-effort: row is already gone
  }
  return NextResponse.json({ ok: true });
}
