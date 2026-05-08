import { cookies } from "next/headers";
import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { eq, gt, and } from "drizzle-orm";
import { db, adminSessions } from "./db";

const COOKIE_NAME = "admin_session";
const SESSION_TTL_DAYS = 7;

export type AdminSession = {
  id: string;
  expiresAt: Date;
};

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function passwordMatches(provided: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function createSession(): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(adminSessions).values({ tokenHash, expiresAt });
  return { token, expiresAt };
}

export function setSessionCookie(token: string, expiresAt: Date) {
  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export function clearSessionCookie() {
  cookies().set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function readSession(): Promise<AdminSession | null> {
  const c = cookies().get(COOKIE_NAME);
  if (!c?.value) return null;
  const tokenHash = hashToken(c.value);
  const [row] = await db
    .select({ id: adminSessions.id, expiresAt: adminSessions.expiresAt })
    .from(adminSessions)
    .where(
      and(eq(adminSessions.tokenHash, tokenHash), gt(adminSessions.expiresAt, new Date())),
    )
    .limit(1);
  if (!row) return null;
  return { id: row.id, expiresAt: row.expiresAt };
}

export async function destroySession(): Promise<void> {
  const c = cookies().get(COOKIE_NAME);
  if (!c?.value) return;
  const tokenHash = hashToken(c.value);
  await db.delete(adminSessions).where(eq(adminSessions.tokenHash, tokenHash));
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await readSession();
  if (!session) {
    throw new AdminAuthError("Unauthorized");
  }
  return session;
}

export class AdminAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminAuthError";
  }
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
