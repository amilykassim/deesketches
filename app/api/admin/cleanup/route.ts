import { NextResponse } from "next/server";
import { cleanupExpired } from "../../../../src/lib/notes/repo";
import {
  AdminAuthError,
  requireAdmin,
} from "../../../../src/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await requireAdmin();
  } catch (e) {
    if (e instanceof AdminAuthError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    throw e;
  }
  const result = await cleanupExpired();
  return NextResponse.json(result);
}
