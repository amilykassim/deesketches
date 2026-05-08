import { NextResponse } from "next/server";
import {
  clearSessionCookie,
  destroySession,
} from "../../../../src/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  await destroySession();
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}
