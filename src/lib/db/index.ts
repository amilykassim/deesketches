import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import type { NeonDatabase } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "./schema";

if (!neonConfig.webSocketConstructor) {
  neonConfig.webSocketConstructor = ws;
}

let _db: NeonDatabase<typeof schema> | null = null;

function getDb(): NeonDatabase<typeof schema> {
  if (_db) return _db;
  const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "POSTGRES_URL (or DATABASE_URL) must be set to use the database",
    );
  }
  const pool = new Pool({ connectionString: url });
  _db = drizzle(pool, { schema });
  return _db;
}

export const db = new Proxy({} as NeonDatabase<typeof schema>, {
  get(_t, prop) {
    const target = getDb();
    const value = target[prop as keyof typeof target];
    return typeof value === "function" ? value.bind(target) : value;
  },
});

export * from "./schema";
