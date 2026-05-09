"use client";

import { useEffect, useState } from "react";

type Status = "pending" | "approved" | "rejected";

type AdminNote = {
  id: string;
  sender: string;
  recipient: string;
  email: string;
  category: string;
  format: "digital" | "physical";
  cardIds: string[];
  chapters: { title: string; body: string }[];
  createdAt: number;
  key: string;
  status: Status;
  rejectionReason: string | null;
  openedAt: number | null;
};

type Mutating = { id: string; kind: "approve" | "reject" } | null;

type CleanupState =
  | { state: "idle" }
  | { state: "running" }
  | { state: "done"; deleted: number }
  | { state: "error"; message: string };

type Toast = { kind: "success" | "error"; message: string } | null;

const TABS: { id: Status; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

export function NotesClient() {
  const [tab, setTab] = useState<Status>("pending");
  const [items, setItems] = useState<AdminNote[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mutating, setMutating] = useState<Mutating>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [cleanup, setCleanup] = useState<CleanupState>({ state: "idle" });
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const refresh = async (status: Status = tab) => {
    setError(null);
    setItems(null);
    try {
      const res = await fetch(`/api/admin/notes?status=${status}`);
      if (!res.ok) {
        setError(`Server error (${res.status})`);
        return;
      }
      const data = (await res.json()) as { items: AdminNote[] };
      setItems(data.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    }
  };

  useEffect(() => {
    void refresh(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const approve = async (id: string) => {
    setMutating({ id, kind: "approve" });
    try {
      const res = await fetch(`/api/admin/notes/${id}/approve`, {
        method: "POST",
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        const message = j.error ?? `Server error (${res.status})`;
        setError(message);
        setToast({ kind: "error", message: `Approval failed: ${message}` });
        return;
      }
      setItems((curr) => (curr ? curr.filter((n) => n.id !== id) : curr));
      setToast({ kind: "success", message: "Note approved." });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Network error";
      setToast({ kind: "error", message: `Approval failed: ${message}` });
    } finally {
      setMutating(null);
    }
  };

  const runCleanup = async () => {
    setCleanup({ state: "running" });
    try {
      const res = await fetch("/api/admin/cleanup", { method: "POST" });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setCleanup({
          state: "error",
          message: j.error ?? `Server error (${res.status})`,
        });
        return;
      }
      const data = (await res.json()) as { deleted: number };
      setCleanup({ state: "done", deleted: data.deleted });
      void refresh();
    } catch (e) {
      setCleanup({
        state: "error",
        message: e instanceof Error ? e.message : "Network error",
      });
    }
  };

  const reject = async (id: string) => {
    setMutating({ id, kind: "reject" });
    try {
      const res = await fetch(`/api/admin/notes/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim() || undefined }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        const message = j.error ?? `Server error (${res.status})`;
        setError(message);
        setToast({ kind: "error", message: `Rejection failed: ${message}` });
        return;
      }
      setItems((curr) => (curr ? curr.filter((n) => n.id !== id) : curr));
      setRejectingId(null);
      setReason("");
      setToast({ kind: "success", message: "Note rejected." });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Network error";
      setToast({ kind: "error", message: `Rejection failed: ${message}` });
    } finally {
      setMutating(null);
    }
  };

  const emptyMessage = {
    pending: "Nothing waiting. ✓",
    approved: "No approved notes yet.",
    rejected: "No rejected notes.",
  }[tab];

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-3xl">Notes</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={runCleanup}
            disabled={cleanup.state === "running"}
            className="font-ui text-sm border border-ink/20 px-3 py-1 rounded-full hover:bg-ink/5 disabled:opacity-50"
            title="Delete notes older than 7 days from blob storage."
          >
            {cleanup.state === "running" ? "Cleaning…" : "Clean up expired"}
          </button>
          <button
            type="button"
            onClick={() => refresh()}
            className="font-ui text-sm border border-ink/20 px-3 py-1 rounded-full hover:bg-ink/5"
          >
            Refresh
          </button>
        </div>
      </header>

      <div
        role="tablist"
        className="flex gap-1 border-b border-ink/10"
      >
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`font-ui text-sm px-4 py-2 -mb-px border-b-2 transition-colors ${
                active
                  ? "border-ink text-ink"
                  : "border-transparent text-ink/55 hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {cleanup.state === "done" && (
        <p className="font-hand text-ink/75">
          Cleanup finished — {cleanup.deleted} expired note
          {cleanup.deleted === 1 ? "" : "s"} deleted.
        </p>
      )}
      {cleanup.state === "error" && (
        <p className="font-hand text-sketchPink">Cleanup failed: {cleanup.message}</p>
      )}
      {error && <p className="font-hand text-sketchPink">{error}</p>}

      {items === null && !error && (
        <p className="font-hand text-ink/55">Loading…</p>
      )}

      {items !== null && items.length === 0 && (
        <p className="font-hand text-ink/55">{emptyMessage}</p>
      )}

      <ul className="space-y-4">
        {items?.map((n) => (
          <li
            key={n.id}
            className="bg-paper border border-ink/10 rounded-sm p-5"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="font-ui text-xs uppercase tracking-wider text-ink/55">
                  {n.format} · {n.category} · {n.cardIds.length} sketch
                  {n.cardIds.length > 1 ? "es" : ""}
                </div>
                <div className="font-display text-2xl mt-1 truncate">
                  {n.sender} → {n.recipient}
                </div>
                <div className="font-ui text-sm text-ink/65 mt-1">
                  {n.email} · key{" "}
                  <code className="bg-ink/5 px-1.5 rounded">{n.key}</code>
                </div>
                <div className="font-ui text-xs text-ink/55 mt-1">
                  Submitted {new Date(n.createdAt).toLocaleString()}
                </div>
                {n.openedAt && (
                  <div className="font-ui text-xs text-sketchGreen mt-1">
                    Opened {new Date(n.openedAt).toLocaleString()}
                  </div>
                )}
                {n.rejectionReason && (
                  <div className="font-ui text-xs text-sketchPink mt-1">
                    Reason: {n.rejectionReason}
                  </div>
                )}
                <details className="mt-3">
                  <summary className="font-ui text-sm text-ink/65 cursor-pointer hover:text-ink">
                    View chapters ({n.chapters.length})
                  </summary>
                  <div className="mt-3 space-y-3">
                    {n.chapters.map((c, i) => (
                      <div key={i} className="border-l-2 border-ink/15 pl-3">
                        <div className="font-display text-lg">{c.title}</div>
                        <p className="font-hand text-base text-ink/80 mt-1 whitespace-pre-wrap">
                          {c.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
              {tab === "pending" && (
                <div className="flex flex-col items-end gap-2">
                  <button
                    type="button"
                    onClick={() => approve(n.id)}
                    disabled={mutating?.id === n.id}
                    className="font-ui bg-ink text-paper px-4 py-1.5 rounded-full hover:bg-sketchGreen disabled:opacity-50"
                  >
                    {mutating?.id === n.id && mutating.kind === "approve"
                      ? "Approving…"
                      : "Approve"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setRejectingId(rejectingId === n.id ? null : n.id)
                    }
                    className="font-ui text-sm text-sketchPink hover:underline"
                  >
                    {rejectingId === n.id ? "Cancel" : "Reject"}
                  </button>
                </div>
              )}
              {tab !== "pending" && (
                <StatusBadge status={n.status} />
              )}
            </div>

            {tab === "pending" && rejectingId === n.id && (
              <div className="mt-4 pt-4 border-t border-ink/10">
                <label className="block font-ui text-xs uppercase tracking-wider text-ink/55 mb-1">
                  Reason (optional, sent to sender)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  maxLength={500}
                  placeholder="Anything to share with the sender?"
                  className="w-full bg-paper border border-ink/15 rounded-sm p-2 font-hand text-base focus:outline-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => reject(n.id)}
                    disabled={mutating?.id === n.id}
                    className="font-ui bg-sketchPink text-paper px-4 py-1.5 rounded-full disabled:opacity-50"
                  >
                    {mutating?.id === n.id && mutating.kind === "reject"
                      ? "Rejecting…"
                      : "Confirm reject"}
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 font-ui text-sm px-4 py-3 rounded-sm shadow-lg border ${
            toast.kind === "success"
              ? "bg-sketchGreen/95 border-sketchGreen text-ink"
              : "bg-sketchPink/95 border-sketchPink text-paper"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const styles = {
    pending: { bg: "#F6C66744", label: "Pending" },
    approved: { bg: "#6FCF9744", label: "Approved" },
    rejected: { bg: "#FF4D8D33", label: "Rejected" },
  } as const;
  const s = styles[status];
  return (
    <span
      className="font-ui text-xs uppercase tracking-[0.2em] px-3 py-1 rounded-full self-start"
      style={{ background: s.bg, color: "#1a1a1a", border: "1px solid #1a1a1a25" }}
    >
      {s.label}
    </span>
  );
}
