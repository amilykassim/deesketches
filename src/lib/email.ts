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
  // Default to Resend's test sender, which works without a verified domain.
  // Set EMAIL_FROM once you've verified your own domain in Resend.
  return process.env.EMAIL_FROM ?? "Andiko <onboarding@resend.dev>";
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

  // Temporary: route every email to ADMIN_EMAIL (Resend's free tier without a
  // verified domain only allows sending to the account owner). Keep the
  // original recipient visible in the subject so admins can distinguish them.
  const adminTo = process.env.ADMIN_EMAIL;
  const finalTo = adminTo ?? args.to;
  const finalSubject = adminTo
    ? `[→ ${args.to}] ${args.subject}`
    : args.subject;

  const { data, error } = await c.emails.send({
    from: fromAddress(),
    to: finalTo,
    subject: finalSubject,
    html: args.html,
  });
  if (error) {
    console.error("[email] resend rejected send", {
      to: finalTo,
      subject: finalSubject,
      error,
    });
    return;
  }
  console.info("[email] sent", { id: data?.id, to: finalTo, subject: finalSubject });
}

// ---------- template ----------

const PALETTE = {
  paper: "#FBF7F0",
  ink: "#1A1A1A",
  inkSoft: "#1A1A1A99",
  inkLine: "#1A1A1A1A",
  pink: "#FF4D8D",
  orange: "#FF8A3C",
  blue: "#4A90E2",
  yellow: "#F6C667",
  green: "#6FCF97",
};

type ShellOpts = {
  preheader: string;
  accent: string;
  eyebrow: string;
  title: string;
  body: string;
};

function shell(opts: ShellOpts): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(opts.title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Patrick+Hand&display=swap" rel="stylesheet">
<style>
  @media (max-width: 540px) {
    .card { padding: 24px !important; }
    .title { font-size: 30px !important; line-height: 1.15 !important; }
    .pad { padding-left: 18px !important; padding-right: 18px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${PALETTE.paper};font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${PALETTE.ink};-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escape(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PALETTE.paper};">
  <tr><td align="center" class="pad" style="padding:32px 24px;">
    <table role="presentation" width="540" cellpadding="0" cellspacing="0" border="0" style="max-width:540px;width:100%;">
      <tr><td align="center" style="padding:0 0 18px;">
        <span style="font-family:'Caveat',cursive;font-size:34px;font-weight:700;color:${PALETTE.ink};letter-spacing:-0.5px;">Andiko</span>
        <div style="height:6px;width:64px;margin:2px auto 0;background:${PALETTE.pink};border-radius:999px;"></div>
        <div style="font-family:'Patrick Hand',cursive;font-size:13px;color:${PALETTE.inkSoft};margin-top:6px;letter-spacing:0.5px;">tiny sketches, big feelings</div>
      </td></tr>
      <tr><td class="card" style="background:#ffffff;border:1px solid ${PALETTE.inkLine};border-radius:18px;padding:36px 36px 32px;box-shadow:0 1px 0 ${PALETTE.inkLine},0 24px 48px -24px rgba(26,26,26,0.18);">
        <div style="display:inline-block;font-family:'Patrick Hand',cursive;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${opts.accent};padding:4px 10px;border:1px dashed ${opts.accent};border-radius:999px;">${escape(opts.eyebrow)}</div>
        <h1 class="title" style="font-family:'Caveat',cursive;font-weight:700;font-size:42px;line-height:1.1;color:${PALETTE.ink};margin:14px 0 8px;letter-spacing:-0.5px;">${opts.title}</h1>
        <div style="height:3px;width:48px;background:${opts.accent};border-radius:999px;margin:0 0 22px;"></div>
        ${opts.body}
      </td></tr>
      <tr><td style="padding:22px 8px 0;text-align:center;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:${PALETTE.inkSoft};line-height:1.6;">
        Notes quietly disappear 7 days after they're created. No accounts. No traces.<br>
        <span style="opacity:0.75;">Made by hand in Kigali · <a href="https://andiko.studio" style="color:${PALETTE.inkSoft};text-decoration:underline;">andiko.studio</a></span>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function paragraph(html: string): string {
  return `<p style="font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:${PALETTE.ink};margin:0 0 14px;">${html}</p>`;
}

function muted(html: string): string {
  return `<p style="font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:${PALETTE.inkSoft};margin:14px 0 0;">${html}</p>`;
}

function button(href: string, label: string, color: string = PALETTE.ink): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 4px;">
  <tr><td style="border-radius:999px;background:${color};">
    <a href="${href}" style="display:inline-block;padding:13px 24px;font-family:'Patrick Hand',cursive;font-size:16px;letter-spacing:0.3px;color:${PALETTE.paper};text-decoration:none;border-radius:999px;">${escape(label)}</a>
  </td></tr></table>`;
}

function privacyCard(): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0 6px;">
    <tr><td style="padding:16px 18px;background:${PALETTE.paper};border:1px solid ${PALETTE.inkLine};border-radius:12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td valign="top" width="28" style="padding:2px 10px 0 0;font-size:18px;line-height:1;">🔒</td>
          <td style="font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.55;color:${PALETTE.ink};">
            <strong>Private by design.</strong> Only people with both the link <em>and</em> the password can open this note.
          </td>
        </tr>
        <tr><td colspan="2" style="height:8px;"></td></tr>
        <tr>
          <td valign="top" width="28" style="padding:2px 10px 0 0;font-size:18px;line-height:1;">⏳</td>
          <td style="font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.55;color:${PALETTE.ink};">
            <strong>It's only good for 7 days.</strong> The note auto-deletes 7 days after you created it. After that, the link and password stop working too.
          </td>
        </tr>
      </table>
    </td></tr></table>`;
}

function keyBox(args: { url: string; key: string }): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 20px;background:${PALETTE.paper};border:1px dashed ${PALETTE.inkLine};border-radius:14px;">
  <tr><td style="padding:18px 20px;">
    <div style="font-family:'Patrick Hand',cursive;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${PALETTE.inkSoft};margin-bottom:6px;">The link</div>
    <a href="${args.url}" style="font-family:-apple-system,'Segoe UI',Roboto,monospace;font-size:15px;color:${PALETTE.ink};word-break:break-all;text-decoration:underline;">${args.url}</a>
    <div style="height:14px;"></div>
    <div style="font-family:'Patrick Hand',cursive;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${PALETTE.inkSoft};margin-bottom:6px;">The password</div>
    <div style="font-family:'Patrick Hand',cursive;font-size:24px;letter-spacing:3px;color:${PALETTE.ink};background:#fff;border:1px solid ${PALETTE.inkLine};border-radius:10px;padding:10px 14px;display:inline-block;">${escape(args.key)}</div>
  </td></tr></table>`;
}

// ---------- public emails ----------

export async function sendReceived(args: {
  to: string;
  recipient: string;
}): Promise<void> {
  const html = shell({
    preheader: `We got your note for ${args.recipient}. Review starts now.`,
    accent: PALETTE.orange,
    eyebrow: "Note received",
    title: "Got it ✎",
    body: `
${paragraph(`Your note for <strong>${escape(args.recipient)}</strong> just landed in our hands.`)}
${paragraph("It's resting on the review desk now. As soon as it's approved, we'll send you a link and a password to share. And we'll ping you again the moment it's opened.")}
${privacyCard()}
${button("https://andiko.studio/my-notes", "Track this note →", PALETTE.ink)}
${muted("Tip: enter the same email you used to send the note on the page above to peek at its status whenever you'd like.")}
`,
  });
  await send({
    to: args.to,
    subject: "We got your note ✎",
    html,
  });
}

export async function sendApproved(args: {
  to: string;
  recipient: string;
  key: string;
  origin: string;
}): Promise<void> {
  const url = `${args.origin}/read`;
  const html = shell({
    preheader: `Your note for ${args.recipient} is live. Here's how to share it.`,
    accent: PALETTE.green,
    eyebrow: "Approved",
    title: "It's live ✓",
    body: `
${paragraph(`Your note for <strong>${escape(args.recipient)}</strong> just made it through review. Time to put it in their hands.`)}
${paragraph("Send <em>both</em> of these to the recipient. Together they unlock the note:")}
${keyBox({ url, key: args.key })}
${privacyCard()}
${button(url, "Open the reading page", PALETTE.pink)}
${muted(`We'll send you another little note the moment <strong>${escape(args.recipient)}</strong> opens it. ✨`)}
`,
  });
  await send({
    to: args.to,
    subject: "Your note is live ✓",
    html,
  });
}

export async function sendRejected(args: {
  to: string;
  recipient: string;
  reason?: string | null;
}): Promise<void> {
  const reasonBlock = args.reason
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 18px;">
      <tr><td style="padding:14px 18px;background:${PALETTE.paper};border-left:3px solid ${PALETTE.pink};border-radius:6px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:${PALETTE.ink};font-style:italic;">
        ${escape(args.reason)}
      </td></tr></table>`
    : "";
  const html = shell({
    preheader: `Your note for ${args.recipient} needs a small change.`,
    accent: PALETTE.pink,
    eyebrow: "Needs a tweak",
    title: "Almost there",
    body: `
${paragraph(`We couldn't quite send your note to <strong>${escape(args.recipient)}</strong> in its current form.`)}
${args.reason ? paragraph("Here's the note from our reviewer:") : ""}
${reasonBlock}
${paragraph("No pressure. Start a fresh draft whenever you're ready. Most notes only need a tiny rewrite.")}
${button("https://andiko.studio/compose", "Try again →", PALETTE.ink)}
${muted("Stuck? Hit reply, or reach out on WhatsApp. We'll lend a hand.")}
`,
  });
  await send({
    to: args.to,
    subject: "Your note needs a small change",
    html,
  });
}

export async function sendOpened(args: {
  to: string;
  recipient: string;
}): Promise<void> {
  const html = shell({
    preheader: `${args.recipient} just opened your note.`,
    accent: PALETTE.yellow,
    eyebrow: "It landed",
    title: "They opened it ✨",
    body: `
${paragraph(`<strong>${escape(args.recipient)}</strong> just opened the note you wrote for them.`)}
${paragraph("Whatever you said, they're reading it now. Hope it makes their day a little smaller and a little sweeter. 🌷")}
${button("https://andiko.studio/compose", "Send another", PALETTE.pink)}
${muted("Heads up: the note will quietly disappear at the 7-day mark from when you created it. After that the link and password stop working.")}
`,
  });
  await send({
    to: args.to,
    subject: `${args.recipient} opened your note ✨`,
    html,
  });
}

export async function sendAdminNewNote(args: {
  noteId: string;
  sender: string;
  recipient: string;
  email: string;
  category: string;
  chapters: { title: string; body: string }[];
  origin: string;
}): Promise<void> {
  const to = process.env.ADMIN_EMAIL;
  if (!to) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[email] no ADMIN_EMAIL — skipping admin notification");
    }
    return;
  }

  const meta = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;">
    <tr><td style="padding:14px 18px;background:${PALETTE.paper};border:1px solid ${PALETTE.inkLine};border-radius:12px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.7;color:${PALETTE.ink};">
      <strong style="color:${PALETTE.inkSoft};font-weight:600;">From</strong>&nbsp;${escape(args.sender)}<br>
      <strong style="color:${PALETTE.inkSoft};font-weight:600;">To</strong>&nbsp;${escape(args.recipient)}<br>
      <strong style="color:${PALETTE.inkSoft};font-weight:600;">Email</strong>&nbsp;<a href="mailto:${escape(args.email)}" style="color:${PALETTE.ink};">${escape(args.email)}</a><br>
      <strong style="color:${PALETTE.inkSoft};font-weight:600;">Category</strong>&nbsp;${escape(args.category)}<br>
      <strong style="color:${PALETTE.inkSoft};font-weight:600;">Chapters</strong>&nbsp;${args.chapters.length}
    </td></tr></table>`;

  const chapterList = args.chapters
    .map(
      (c, i) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 14px;">
      <tr><td style="padding:16px 18px;background:#fff;border:1px solid ${PALETTE.inkLine};border-radius:12px;">
        <div style="font-family:'Patrick Hand',cursive;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${PALETTE.inkSoft};margin-bottom:4px;">Chapter ${i + 1}</div>
        <div style="font-family:'Caveat',cursive;font-size:24px;line-height:1.1;font-weight:700;color:${PALETTE.ink};margin-bottom:8px;">${escape(c.title || "(untitled)")}</div>
        <div style="font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.65;color:${PALETTE.ink};white-space:pre-wrap;">${escape(c.body)}</div>
      </td></tr></table>`,
    )
    .join("");

  const html = shell({
    preheader: `New note from ${args.sender} → ${args.recipient} awaiting your review.`,
    accent: PALETTE.blue,
    eyebrow: "Admin · review queue",
    title: "A new note needs your eyes",
    body: `
${paragraph(`<strong>${escape(args.sender)}</strong> just sent a note for <strong>${escape(args.recipient)}</strong>. It's waiting for your nod before it goes live.`)}
${meta}
${chapterList}
${button(`${args.origin}/admin/notes`, "Review on the dashboard →", PALETTE.ink)}
${muted(`Note ID: <code style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:${PALETTE.paper};padding:2px 6px;border-radius:4px;">${escape(args.noteId)}</code>`)}
`,
  });

  await send({
    to,
    subject: `New note awaiting approval: ${args.sender} → ${args.recipient}`,
    html,
  });
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
