"use client";

import { useEffect, useMemo, useState } from "react";

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

type Mutating =
  | { id: string; kind: "approve" | "reject" | "delete" }
  | { kind: "delete-all" }
  | null;

type CleanupState =
  | { state: "idle" }
  | { state: "running" }
  | { state: "done"; deleted: number }
  | { state: "error"; message: string };

type Toast = { kind: "success" | "error"; message: string } | null;

type LoadState =
  | { state: "idle" }
  | { state: "loading"; loaded: number; total: number | null }
  | { state: "ready" }
  | { state: "error"; message: string };

type Tab = Status | "all";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

const FETCH_PAGE_SIZE = 100;
const VIEW_PAGE_SIZE = 5;

type NotesPage = {
  page: number;
  pageSize: number;
  total: number;
  items: AdminNote[];
};

export function NotesClient() {
  const [tab, setTab] = useState<Tab>("all");
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [load, setLoad] = useState<LoadState>({ state: "idle" });
  const [page, setPage] = useState(1);
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

  const fetchAll = async () => {
    setLoad({ state: "loading", loaded: 0, total: null });
    try {
      const all: AdminNote[] = [];
      let p = 1;
      let total = 0;
      while (true) {
        const res = await fetch(
          `/api/admin/notes?page=${p}&pageSize=${FETCH_PAGE_SIZE}`,
        );
        if (!res.ok) {
          setLoad({
            state: "error",
            message: `Server error (${res.status})`,
          });
          return;
        }
        const data = (await res.json()) as NotesPage;
        all.push(...data.items);
        total = data.total;
        setLoad({ state: "loading", loaded: all.length, total });
        if (all.length >= total || data.items.length === 0) break;
        p += 1;
      }
      setNotes(all);
      setLoad({ state: "ready" });
    } catch (e) {
      setLoad({
        state: "error",
        message: e instanceof Error ? e.message : "Network error",
      });
    }
  };

  useEffect(() => {
    void fetchAll();
  }, []);

  // Reset to page 1 whenever the active tab changes — the filtered list is
  // a different length per status, so the previously-active page index is
  // meaningless.
  useEffect(() => {
    setPage(1);
  }, [tab]);

  const filtered = useMemo(
    () => (tab === "all" ? notes : notes.filter((n) => n.status === tab)),
    [notes, tab],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / VIEW_PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (safePage - 1) * VIEW_PAGE_SIZE,
    safePage * VIEW_PAGE_SIZE,
  );

  const counts = useMemo(() => {
    const c: Record<Tab, number> = {
      all: notes.length,
      pending: 0,
      approved: 0,
      rejected: 0,
    };
    for (const n of notes) c[n.status] += 1;
    return c;
  }, [notes]);

  const updateLocal = (id: string, patch: Partial<AdminNote>) => {
    setNotes((curr) => curr.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  };
  const removeLocal = (id: string) => {
    setNotes((curr) => curr.filter((n) => n.id !== id));
  };

  const approve = async (id: string) => {
    setMutating({ id, kind: "approve" });
    try {
      const res = await fetch(`/api/admin/notes/${id}/approve`, {
        method: "POST",
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        const message = j.error ?? `Server error (${res.status})`;
        setToast({ kind: "error", message: `Approval failed: ${message}` });
        return;
      }
      updateLocal(id, { status: "approved" });
      setToast({ kind: "success", message: "Note approved." });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Network error";
      setToast({ kind: "error", message: `Approval failed: ${message}` });
    } finally {
      setMutating(null);
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
        setToast({ kind: "error", message: `Rejection failed: ${message}` });
        return;
      }
      updateLocal(id, {
        status: "rejected",
        rejectionReason: reason.trim() || null,
      });
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

  const deleteOne = async (id: string, sender: string, recipient: string) => {
    if (
      !window.confirm(
        `Permanently delete the note from ${sender} → ${recipient}? This cannot be undone.`,
      )
    ) {
      return;
    }
    setMutating({ id, kind: "delete" });
    try {
      const res = await fetch(`/api/admin/notes/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        const message = j.error ?? `Server error (${res.status})`;
        setToast({ kind: "error", message: `Delete failed: ${message}` });
        return;
      }
      removeLocal(id);
      setToast({ kind: "success", message: "Note deleted." });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Network error";
      setToast({ kind: "error", message: `Delete failed: ${message}` });
    } finally {
      setMutating(null);
    }
  };

  const deleteAll = async () => {
    if (
      !window.confirm(
        "Delete EVERY note (pending, approved, and rejected)? This cannot be undone.",
      )
    ) {
      return;
    }
    setMutating({ kind: "delete-all" });
    try {
      const res = await fetch("/api/admin/notes/delete-all", {
        method: "POST",
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        const message = j.error ?? `Server error (${res.status})`;
        setToast({ kind: "error", message: `Delete-all failed: ${message}` });
        return;
      }
      const data = (await res.json()) as { deleted: number };
      setNotes([]);
      setToast({
        kind: "success",
        message: `Deleted ${data.deleted} note${data.deleted === 1 ? "" : "s"}.`,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Network error";
      setToast({ kind: "error", message: `Delete-all failed: ${message}` });
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
      void fetchAll();
    } catch (e) {
      setCleanup({
        state: "error",
        message: e instanceof Error ? e.message : "Network error",
      });
    }
  };

  const emptyMessage: string = {
    all: "No notes yet.",
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
            onClick={() => fetchAll()}
            disabled={load.state === "loading"}
            className="font-ui text-sm border border-ink/20 px-3 py-1 rounded-full hover:bg-ink/5 disabled:opacity-50"
          >
            {load.state === "loading" ? "Refreshing…" : "Refresh"}
          </button>
          <button
            type="button"
            onClick={deleteAll}
            disabled={mutating?.kind === "delete-all"}
            className="font-ui text-sm border border-sketchPink text-sketchPink px-3 py-1 rounded-full hover:bg-sketchPink hover:text-paper disabled:opacity-50"
            title="Permanently delete every note in storage."
          >
            {mutating?.kind === "delete-all" ? "Deleting…" : "Delete all"}
          </button>
        </div>
      </header>

      <div role="tablist" className="flex gap-1 border-b border-ink/10">
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
              {t.label}{" "}
              <span className="text-ink/40">({counts[t.id]})</span>
            </button>
          );
        })}
      </div>

      {cleanup.state === "done" && (
        <p className="font-hand text-ink/75">
          Cleanup finished. {cleanup.deleted} expired note
          {cleanup.deleted === 1 ? "" : "s"} deleted.
        </p>
      )}
      {cleanup.state === "error" && (
        <p className="font-hand text-sketchPink">
          Cleanup failed: {cleanup.message}
        </p>
      )}
      {load.state === "error" && (
        <p className="font-hand text-sketchPink">
          Couldn't load notes: {load.message}
        </p>
      )}

      {load.state === "loading" && notes.length === 0 && (
        <p className="font-hand text-ink/55">
          Loading
          {load.total !== null ? ` ${load.loaded} / ${load.total}` : "…"}
        </p>
      )}

      {load.state === "ready" && filtered.length === 0 && (
        <p className="font-hand text-ink/55">{emptyMessage}</p>
      )}

      <ul className="space-y-4">
        {visible.map((n) => (
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
              <div className="flex flex-col items-end gap-2">
                {n.status === "pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => approve(n.id)}
                      disabled={!!(mutating && "id" in mutating && mutating.id === n.id)}
                      className="font-ui bg-ink text-paper px-4 py-1.5 rounded-full hover:bg-sketchGreen disabled:opacity-50"
                    >
                      {mutating && "id" in mutating && mutating.id === n.id && mutating.kind === "approve"
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
                  </>
                ) : (
                  <StatusBadge status={n.status} />
                )}
                <button
                  type="button"
                  onClick={() => deleteOne(n.id, n.sender, n.recipient)}
                  disabled={!!(mutating && "id" in mutating && mutating.id === n.id)}
                  className="font-ui text-xs text-ink/55 hover:text-sketchPink disabled:opacity-50"
                  title="Permanently delete this note"
                >
                  {mutating && "id" in mutating && mutating.id === n.id && mutating.kind === "delete"
                    ? "Deleting…"
                    : "Delete"}
                </button>
              </div>
            </div>

            {n.status === "pending" && rejectingId === n.id && (
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
                    disabled={!!(mutating && "id" in mutating && mutating.id === n.id)}
                    className="font-ui bg-sketchPink text-paper px-4 py-1.5 rounded-full disabled:opacity-50"
                  >
                    {mutating && "id" in mutating && mutating.id === n.id && mutating.kind === "reject"
                      ? "Rejecting…"
                      : "Confirm reject"}
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {pageCount > 1 && filtered.length > 0 && (
        <nav
          className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-ink/10"
          aria-label="Notes pagination"
        >
          <span className="font-ui text-xs text-ink/55">
            Page {safePage} of {pageCount} · {filtered.length}
            {tab === "all" ? "" : ` ${tab}`} note
            {filtered.length === 1 ? "" : "s"}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, safePage - 1))}
              disabled={safePage === 1}
              className="font-ui text-sm border border-ink/20 px-3 py-1 rounded-full hover:bg-ink/5 disabled:opacity-30"
            >
              ← prev
            </button>
            <button
              type="button"
              onClick={() => setPage(Math.min(pageCount, safePage + 1))}
              disabled={safePage === pageCount}
              className="font-ui text-sm border border-ink/20 px-3 py-1 rounded-full hover:bg-ink/5 disabled:opacity-30"
            >
              next →
            </button>
          </div>
        </nav>
      )}

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
