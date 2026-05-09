import { del, get, list, put } from "@vercel/blob";
import type { PutOpts, Storage, StoredObject } from "./types";

function token(): string {
  const t = process.env.BLOB_READ_WRITE_TOKEN;
  if (!t) {
    throw new Error(
      "STORAGE_DRIVER=vercel requires BLOB_READ_WRITE_TOKEN to be set",
    );
  }
  return t;
}

function access(): "public" | "private" {
  // Notes contain sender email + message content, so private is the safer
  // default. Public stores can opt in via BLOB_ACCESS=public.
  const raw = (process.env.BLOB_ACCESS ?? "private").toLowerCase();
  if (raw !== "public" && raw !== "private") {
    throw new Error(
      `BLOB_ACCESS must be "public" or "private" (got "${raw}")`,
    );
  }
  return raw;
}

export class VercelBlobStorage implements Storage {
  async put(
    key: string,
    body: Buffer | Blob,
    opts?: PutOpts,
  ): Promise<StoredObject> {
    const result = await put(key, body, {
      access: access(),
      addRandomSuffix: false,
      // We use deterministic keys and rewrite blobs in-place (note status
      // updates, openedAt). v2.x errors on existing pathnames by default.
      allowOverwrite: true,
      token: token(),
      contentType: opts?.contentType,
    });
    return { key, url: result.url };
  }

  async get(key: string): Promise<Buffer | null> {
    try {
      const result = await get(key, { access: access(), token: token() });
      if (!result || result.statusCode !== 200) return null;
      const ab = await new Response(result.stream).arrayBuffer();
      return Buffer.from(ab);
    } catch (e) {
      // BlobNotFoundError → null; let other errors surface.
      const name = (e as { name?: string } | null)?.name ?? "";
      if (name === "BlobNotFoundError") return null;
      throw e;
    }
  }

  async list(prefix: string): Promise<StoredObject[]> {
    const result = await list({ prefix, token: token() });
    return result.blobs.map((b) => ({ key: b.pathname, url: b.url }));
  }

  async delete(key: string): Promise<void> {
    await del(key, { token: token() });
  }

  async getUrl(key: string): Promise<string> {
    const objects = await list({ prefix: key, token: token() });
    const exact = objects.blobs.find((b) => b.pathname === key);
    if (!exact) throw new Error(`Blob not found: ${key}`);
    return exact.url;
  }
}
