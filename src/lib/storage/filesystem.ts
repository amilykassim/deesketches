import { mkdir, readdir, readFile, rm, stat, writeFile } from "fs/promises";
import { dirname, join, resolve } from "path";
import type { PutOpts, Storage, StoredObject } from "./types";

const ROOT = resolve(process.cwd(), ".storage");

function pathFor(key: string): string {
  if (key.startsWith("/") || key.includes("..")) {
    throw new Error(`Invalid storage key: ${key}`);
  }
  return join(ROOT, key);
}

async function existsFile(p: string): Promise<boolean> {
  try {
    const s = await stat(p);
    return s.isFile();
  } catch {
    return false;
  }
}

async function* walk(dir: string, prefix: string): AsyncGenerator<string> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    const rel = prefix ? `${prefix}/${e.name}` : e.name;
    if (e.isDirectory()) yield* walk(full, rel);
    else yield rel;
  }
}

export class FilesystemStorage implements Storage {
  async put(
    key: string,
    body: Buffer | Blob,
    _opts?: PutOpts,
  ): Promise<StoredObject> {
    const p = pathFor(key);
    await mkdir(dirname(p), { recursive: true });
    const buf =
      body instanceof Buffer
        ? body
        : Buffer.from(await (body as Blob).arrayBuffer());
    await writeFile(p, buf);
    return { key, url: `/storage/${encodeKey(key)}` };
  }

  async get(key: string): Promise<Buffer | null> {
    const p = pathFor(key);
    if (!(await existsFile(p))) return null;
    return readFile(p);
  }

  async list(prefix: string): Promise<StoredObject[]> {
    const root = pathFor(prefix);
    const out: StoredObject[] = [];
    for await (const rel of walk(root, prefix)) {
      out.push({ key: rel, url: `/storage/${encodeKey(rel)}` });
    }
    return out;
  }

  async delete(key: string): Promise<void> {
    const p = pathFor(key);
    await rm(p, { force: true });
  }

  async getUrl(key: string): Promise<string> {
    return `/storage/${encodeKey(key)}`;
  }
}

function encodeKey(key: string): string {
  return key.split("/").map(encodeURIComponent).join("/");
}

export function readFilesystemKey(key: string): Promise<Buffer | null> {
  return new FilesystemStorage().get(key);
}
