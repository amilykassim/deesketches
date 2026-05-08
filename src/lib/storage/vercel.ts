import { del, list, put } from "@vercel/blob";
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

export class VercelBlobStorage implements Storage {
  async put(
    key: string,
    body: Buffer | Blob,
    opts?: PutOpts,
  ): Promise<StoredObject> {
    const result = await put(key, body, {
      access: "public",
      addRandomSuffix: false,
      token: token(),
      contentType: opts?.contentType,
    });
    return { key, url: result.url };
  }

  async get(key: string): Promise<Buffer | null> {
    const objects = await list({ prefix: key, token: token() });
    const exact = objects.blobs.find((b) => b.pathname === key);
    if (!exact) return null;
    const res = await fetch(exact.url);
    if (!res.ok) return null;
    const ab = await res.arrayBuffer();
    return Buffer.from(ab);
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
