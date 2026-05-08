"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setError("Title and audio file are required.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("title", title);
      if (mood.trim()) fd.set("mood", mood);
      const res = await fetch("/api/admin/audio", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error ?? `Error ${res.status}`);
        return;
      }
      router.push("/admin/audio");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="font-display text-3xl mb-8">Upload audio clip</h1>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="font-ui text-sm text-ink/70">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Soft piano loop"
            className="mt-1 w-full bg-paper border border-ink/20 px-3 py-2 rounded-sm font-ui focus:outline-none focus:border-ink/50"
          />
        </label>
        <label className="block">
          <span className="font-ui text-sm text-ink/70">Mood / category (optional)</span>
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="e.g. cozy, romantic, playful"
            className="mt-1 w-full bg-paper border border-ink/20 px-3 py-2 rounded-sm font-ui focus:outline-none focus:border-ink/50"
          />
        </label>
        <label className="block">
          <span className="font-ui text-sm text-ink/70">File (mp3, m4a, ogg, wav)</span>
          <input
            type="file"
            accept="audio/mpeg,audio/mp4,audio/x-m4a,audio/m4a,audio/ogg,audio/wav,audio/x-wav"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1 w-full font-ui"
          />
        </label>
        {error && <p className="font-hand text-sketchPink text-sm">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="font-ui bg-ink text-paper px-5 py-2 rounded-full hover:bg-sketchPink transition-colors disabled:opacity-50"
        >
          {busy ? "Uploading…" : "Upload"}
        </button>
      </form>
    </div>
  );
}
