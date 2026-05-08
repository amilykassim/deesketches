import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { parseBuffer } from "music-metadata";
import { db, audioClips } from "../../../../src/lib/db";
import { getStorage } from "../../../../src/lib/storage";
import {
  AdminAuthError,
  requireAdmin,
} from "../../../../src/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_MIMES = new Set([
  "audio/mpeg",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
  "audio/ogg",
  "audio/wav",
  "audio/x-wav",
]);

const EXT_FOR: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/m4a": "m4a",
  "audio/ogg": "ogg",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
};

export async function GET() {
  try {
    await requireAdmin();
  } catch (e) {
    if (e instanceof AdminAuthError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    throw e;
  }
  const rows = await db
    .select()
    .from(audioClips)
    .orderBy(desc(audioClips.createdAt));
  return NextResponse.json({ clips: rows });
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch (e) {
    if (e instanceof AdminAuthError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    throw e;
  }

  const form = await req.formData();
  const file = form.get("file");
  const title = form.get("title");
  const mood = form.get("mood");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Missing title" }, { status: 400 });
  }
  const mime = file.type;
  if (!ALLOWED_MIMES.has(mime)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${mime || "unknown"}` },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let durationSec = 0;
  try {
    const meta = await parseBuffer(buffer, { mimeType: mime });
    durationSec = Math.round(meta.format.duration ?? 0);
  } catch {
    durationSec = 0;
  }

  const ext = EXT_FOR[mime] ?? "bin";
  const id = randomUUID();
  const key = `audio/${id}.${ext}`;
  const stored = await getStorage().put(key, buffer, { contentType: mime });

  const [row] = await db
    .insert(audioClips)
    .values({
      id,
      title: title.trim(),
      mood: typeof mood === "string" && mood.trim() ? mood.trim() : null,
      blobKey: stored.key,
      blobUrl: stored.url,
      durationSec,
      mimeType: mime,
    })
    .returning();

  return NextResponse.json({ clip: row }, { status: 201 });
}
