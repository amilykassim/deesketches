"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  id: string;
  title: string;
  mood: string;
};

export function AudioRowActions({ id, title, mood }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [curTitle, setCurTitle] = useState(title);
  const [curMood, setCurMood] = useState(mood);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/audio/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: curTitle, mood: curMood }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error ?? `Error ${res.status}`);
        return;
      }
      setEditing(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/audio/${id}`, { method: "DELETE" });
      if (res.status === 409) {
        const j = (await res.json()) as {
          error: string;
          referencingBooks: { id: string; sender: string; recipient: string }[];
        };
        const list = j.referencingBooks
          .slice(0, 5)
          .map((b) => `• ${b.sender} → ${b.recipient}`)
          .join("\n");
        alert(
          `Cannot delete: this clip is in use by ${j.referencingBooks.length} book(s):\n\n${list}\n\nDetach it from those books first.`,
        );
        return;
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error ?? `Error ${res.status}`);
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  if (editing) {
    return (
      <div className="flex flex-col gap-1 items-end">
        <input
          value={curTitle}
          onChange={(e) => setCurTitle(e.target.value)}
          className="border border-ink/20 px-2 py-1 rounded-sm text-sm"
          placeholder="Title"
        />
        <input
          value={curMood}
          onChange={(e) => setCurMood(e.target.value)}
          className="border border-ink/20 px-2 py-1 rounded-sm text-sm"
          placeholder="Mood (optional)"
        />
        <div className="flex gap-2 mt-1">
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="text-sm font-ui px-2 py-1 bg-ink text-paper rounded-full disabled:opacity-50"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setCurTitle(title);
              setCurMood(mood);
              setError(null);
            }}
            disabled={busy}
            className="text-sm font-ui px-2 py-1 border border-ink/20 rounded-full"
          >
            Cancel
          </button>
        </div>
        {error && <p className="text-xs text-sketchPink">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex gap-2 justify-end">
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="font-ui text-sm text-ink/70 hover:text-ink"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={remove}
        disabled={busy}
        className="font-ui text-sm text-sketchPink hover:underline disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
