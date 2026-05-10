// TEMP TEST COMPONENT — delete this file (and its uses in Navbar) when done.
"use client";

import { useState } from "react";

export function TempEmailTestButton() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  // Hidden on production builds. Still available during local `next dev`.
  if (process.env.NODE_ENV === "production") return null;

  async function trigger() {
    setStatus("sending");
    try {
      const res = await fetch("/api/test-email", { method: "POST" });
      const data = (await res.json()) as { ok?: boolean };
      setStatus(data.ok ? "ok" : "err");
    } catch {
      setStatus("err");
    }
    window.setTimeout(() => setStatus("idle"), 4000);
  }

  const label =
    status === "sending"
      ? "Sending…"
      : status === "ok"
        ? "Sent ✓ check inbox"
        : status === "err"
          ? "Failed — check logs"
          : "Test email";

  const bg =
    status === "ok" ? "#16a34a" : status === "err" ? "#dc2626" : "#FF4D8D";

  return (
    <button
      type="button"
      onClick={trigger}
      disabled={status === "sending"}
      title="TEMP — sends a fake new-note email to ADMIN_EMAIL"
      className="inline-flex items-center font-ui text-sm px-3 py-1.5 rounded-full text-white pencil-cursor"
      style={{ background: bg, whiteSpace: "nowrap" }}
    >
      {label}
    </button>
  );
}
