import { NextResponse } from "next/server";
import {
  createSession,
  passwordMatches,
  setSessionCookie,
} from "../../../../src/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { password?: unknown };
  try {
    body = (await req.json()) as { password?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (typeof body.password !== "string") {
    return NextResponse.json({ error: "Missing password" }, { status: 400 });
  }
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Admin password is not configured on the server" },
      { status: 500 },
    );
  }
  if (!passwordMatches(body.password)) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  const { token, expiresAt } = await createSession();
  setSessionCookie(token, expiresAt);
  return NextResponse.json({ ok: true });
}
