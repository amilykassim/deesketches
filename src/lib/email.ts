import { Resend } from "resend";

let _client: Resend | null = null;

function client(): Resend | null {
  if (_client) return _client;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  _client = new Resend(key);
  return _client;
}

function fromAddress(): string {
  return process.env.EMAIL_FROM ?? "Andiko <noreply@andiko.studio>";
}

async function send(args: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const c = client();
  if (!c) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[email] no RESEND_API_KEY — skipping send", args.to, args.subject);
    }
    return;
  }
  try {
    await c.emails.send({
      from: fromAddress(),
      to: args.to,
      subject: args.subject,
      html: args.html,
    });
  } catch (e) {
    console.error("[email] send failed", e);
  }
}

const wrap = (body: string) => `
<!doctype html>
<html><body style="font-family: -apple-system, system-ui, sans-serif; color: #1a1a1a; background: #fbf7f0; padding: 24px;">
<div style="max-width: 480px; margin: 0 auto; background: #fff; padding: 28px; border: 1px solid #1a1a1a18;">
${body}
<hr style="border: none; border-top: 1px solid #1a1a1a18; margin: 24px 0;">
<p style="font-size: 12px; color: #1a1a1a99;">
Notes auto-disappear 7 days after creation. No accounts, no traces.
</p>
</div>
</body></html>`;

export async function sendReceived(args: {
  to: string;
  recipient: string;
}): Promise<void> {
  await send({
    to: args.to,
    subject: "We got your note ✎",
    html: wrap(`
<h2 style="margin-top: 0;">Got it!</h2>
<p>We received your note for <strong>${escape(args.recipient)}</strong>.</p>
<p>It's now waiting for an admin review. We'll email you the moment it's approved — and again when ${escape(args.recipient)} opens it.</p>
<p>You can check the status anytime by entering your email at <a href="https://andiko.studio/my-notes">andiko.studio/my-notes</a>.</p>
`),
  });
}

export async function sendApproved(args: {
  to: string;
  recipient: string;
  key: string;
  origin: string;
}): Promise<void> {
  await send({
    to: args.to,
    subject: "Your note is live ✓",
    html: wrap(`
<h2 style="margin-top: 0;">Approved!</h2>
<p>Your note for <strong>${escape(args.recipient)}</strong> is live.</p>
<p>Share these with the recipient:</p>
<p><strong>Link:</strong> <a href="${args.origin}/read">${args.origin}/read</a></p>
<p><strong>Password:</strong> <code style="background:#1a1a1a0d;padding:2px 6px;border-radius:4px;">${escape(args.key)}</code></p>
<p>We'll let you know when ${escape(args.recipient)} opens it.</p>
`),
  });
}

export async function sendRejected(args: {
  to: string;
  recipient: string;
  reason?: string | null;
}): Promise<void> {
  await send({
    to: args.to,
    subject: "Your note needs changes",
    html: wrap(`
<h2 style="margin-top: 0;">We couldn't approve this one.</h2>
<p>Your note for <strong>${escape(args.recipient)}</strong> wasn't approved.</p>
${args.reason ? `<p><em>${escape(args.reason)}</em></p>` : ""}
<p>Feel free to start over — and reach out on WhatsApp if you'd like a hand.</p>
`),
  });
}

export async function sendOpened(args: {
  to: string;
  recipient: string;
}): Promise<void> {
  await send({
    to: args.to,
    subject: `${args.recipient} opened your note ✨`,
    html: wrap(`
<h2 style="margin-top: 0;">It landed.</h2>
<p><strong>${escape(args.recipient)}</strong> just opened the note you sent.</p>
<p>Hope it made their day a little smaller and sweeter.</p>
`),
  });
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
