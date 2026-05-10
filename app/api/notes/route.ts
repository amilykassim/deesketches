import { NextResponse } from "next/server";
import { db, events } from "../../../src/lib/db";
import { createNote } from "../../../src/lib/notes/repo";
import { sendReceived, sendAdminNewNote } from "../../../src/lib/email";
import { isValidKeyShape } from "../../../src/lib/key";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Chapter = { title: string; body: string };

type Body = {
  k?: unknown;
  format?: unknown;
  category?: unknown;
  cardIds?: unknown;
  sender?: unknown;
  recipient?: unknown;
  email?: unknown;
  storySource?: unknown;
  storyArcId?: unknown;
  chapters?: unknown;
};

const VALID_FORMATS = new Set(["digital", "physical"]);
const VALID_SOURCES = new Set(["self", "magic_writer"]);

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function isChapterArray(v: unknown): v is Chapter[] {
  return (
    Array.isArray(v) &&
    v.every(
      (c) =>
        c &&
        typeof c === "object" &&
        typeof (c as Chapter).title === "string" &&
        typeof (c as Chapter).body === "string",
    )
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FRIENDLY_500 =
  "The studio tipped over for a sec. Please try again in a moment.";

export async function POST(req: Request) {
  try {
    return await handle(req);
  } catch (e) {
    console.error("[notes.create]", e);
    return NextResponse.json({ error: FRIENDLY_500 }, { status: 500 });
  }
}

async function handle(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { k, format, category, sender, recipient, email, storySource, storyArcId } = body;

  if (typeof k !== "string" || !isValidKeyShape(k)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }
  if (typeof format !== "string" || !VALID_FORMATS.has(format)) {
    return NextResponse.json({ error: "Invalid format" }, { status: 400 });
  }
  if (typeof category !== "string" || !category) {
    return NextResponse.json({ error: "Missing category" }, { status: 400 });
  }
  if (!isStringArray(body.cardIds) || body.cardIds.length === 0) {
    return NextResponse.json({ error: "Invalid cardIds" }, { status: 400 });
  }
  if (typeof sender !== "string" || typeof recipient !== "string") {
    return NextResponse.json({ error: "Invalid sender/recipient" }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (typeof storySource !== "string" || !VALID_SOURCES.has(storySource)) {
    return NextResponse.json({ error: "Invalid storySource" }, { status: 400 });
  }
  if (!isChapterArray(body.chapters)) {
    return NextResponse.json({ error: "Invalid chapters" }, { status: 400 });
  }
  if (storyArcId !== undefined && storyArcId !== null && typeof storyArcId !== "string") {
    return NextResponse.json({ error: "Invalid storyArcId" }, { status: 400 });
  }

  const result = await createNote({
    key: k.trim(),
    format: format as "digital" | "physical",
    category,
    cardIds: body.cardIds as string[],
    sender,
    recipient,
    email: email.trim(),
    storySource: storySource as "self" | "magic_writer",
    storyArcId: (storyArcId as string | undefined) ?? null,
    chapters: body.chapters as Chapter[],
  });

  if ("error" in result) {
    return NextResponse.json({ error: "Key already in use" }, { status: 409 });
  }

  // Fire analytics event (best effort — don't block response on failure).
  void (async () => {
    try {
      await db.insert(events).values([
        {
          type: "book_created",
          bookId: result.id,
          metadata: { storySource, category, sender, recipient, hasEmail: true },
        },
        ...(storySource === "magic_writer"
          ? [
              {
                type: "magic_writer_used",
                bookId: result.id,
                metadata: { category, sender, recipient },
              },
            ]
          : []),
      ]);
    } catch (e) {
      console.error("[notes.create] event log failed", e);
    }
  })();

  // Send emails before returning — on serverless, the function is suspended
  // as soon as the response is sent, so fire-and-forget calls never complete.
  const url = new URL(req.url);
  const origin = `${url.protocol}//${url.host}`;
  await Promise.allSettled([
    sendReceived({ to: email.trim(), recipient }),
    sendAdminNewNote({
      noteId: result.id,
      sender,
      recipient,
      email: email.trim(),
      category,
      chapters: body.chapters as Chapter[],
      origin,
    }),
  ]);

  return NextResponse.json({ id: result.id }, { status: 201 });
}
