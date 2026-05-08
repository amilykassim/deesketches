import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, audioClips } from "../../../../src/lib/db";
import { AudioPreview } from "../../_components/AudioPreview";
import { AudioRowActions } from "../../_components/AudioRowActions";

export const dynamic = "force-dynamic";

function formatDuration(seconds: number): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default async function AudioLibraryPage() {
  const clips = await db
    .select()
    .from(audioClips)
    .orderBy(desc(audioClips.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Audio library</h1>
        <Link
          href="/admin/audio/upload"
          className="font-ui bg-ink text-paper px-4 py-2 rounded-full hover:bg-sketchPink transition-colors"
        >
          + Upload clip
        </Link>
      </div>

      {clips.length === 0 ? (
        <p className="font-hand text-ink/60">
          No clips yet. Upload one to get started.
        </p>
      ) : (
        <div className="border border-ink/10 rounded-sm overflow-hidden">
          <table className="w-full text-sm font-ui">
            <thead className="bg-ink/5 text-ink/60 text-left">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Mood</th>
                <th className="px-4 py-2">Duration</th>
                <th className="px-4 py-2">Preview</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {clips.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-medium text-ink">{c.title}</td>
                  <td className="px-4 py-3 text-ink/70">{c.mood ?? "—"}</td>
                  <td className="px-4 py-3 text-ink/70">
                    {formatDuration(c.durationSec)}
                  </td>
                  <td className="px-4 py-3">
                    <AudioPreview url={c.blobUrl} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <AudioRowActions
                      id={c.id}
                      title={c.title}
                      mood={c.mood ?? ""}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
