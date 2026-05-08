import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db, audioClips } from "../../../src/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db
    .select({
      id: audioClips.id,
      title: audioClips.title,
      mood: audioClips.mood,
      url: audioClips.blobUrl,
      durationSec: audioClips.durationSec,
    })
    .from(audioClips)
    .orderBy(desc(audioClips.createdAt));
  return NextResponse.json({ clips: rows });
}
