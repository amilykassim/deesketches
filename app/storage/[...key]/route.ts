import { NextResponse } from "next/server";
import { readFilesystemKey } from "../../../src/lib/storage/filesystem";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIME: Record<string, string> = {
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  ogg: "audio/ogg",
  wav: "audio/wav",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

function contentTypeFor(key: string): string {
  const dot = key.lastIndexOf(".");
  if (dot < 0) return "application/octet-stream";
  const ext = key.slice(dot + 1).toLowerCase();
  return MIME[ext] ?? "application/octet-stream";
}

export async function GET(
  _req: Request,
  { params }: { params: { key: string[] } },
) {
  if ((process.env.STORAGE_DRIVER ?? "filesystem").toLowerCase() !== "filesystem") {
    return new NextResponse("Filesystem storage handler is dev-only", { status: 404 });
  }
  const key = params.key.map(decodeURIComponent).join("/");
  const buf = await readFilesystemKey(key);
  if (!buf) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      "Content-Type": contentTypeFor(key),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
