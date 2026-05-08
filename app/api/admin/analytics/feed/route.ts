import { NextResponse } from "next/server";
import { getFeed } from "../../../../../src/lib/analytics";
import {
  AdminAuthError,
  requireAdmin,
} from "../../../../../src/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await requireAdmin();
  } catch (e) {
    if (e instanceof AdminAuthError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    throw e;
  }
  const url = new URL(req.url);
  const cursorParam = url.searchParams.get("cursor");
  const cursor = cursorParam ? Number(cursorParam) : null;
  const data = await getFeed(Number.isFinite(cursor as number) ? cursor : null);
  return NextResponse.json(data);
}
