// TEMP TEST ROUTE — delete this file when email testing is done.
// Sends fake "received" + "admin new note" emails so we can verify Resend is wired up.
import { NextResponse } from "next/server";
import { sendReceived, sendAdminNewNote } from "../../../src/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const origin = `${url.protocol}//${url.host}`;

  const sample = {
    noteId: "test-" + Date.now(),
    sender: "Test Sender",
    recipient: "Test Recipient",
    email: "test-sender@example.com",
    category: "love",
    chapters: [
      { title: "Chapter one", body: "This is a test note. If you're reading this, the email pipeline works." },
    ],
    origin,
  };

  const results = await Promise.allSettled([
    sendReceived({ to: sample.email, recipient: sample.recipient }),
    sendAdminNewNote(sample),
  ]);

  const failed = results
    .map((r, i) => (r.status === "rejected" ? { i, reason: String(r.reason) } : null))
    .filter(Boolean);

  return NextResponse.json({
    ok: failed.length === 0,
    failed,
    note: "Check Vercel function logs for [email] sent / [email] resend rejected send entries.",
  });
}
