import type { Storage } from "./types";
import { FilesystemStorage } from "./filesystem";
import { VercelBlobStorage } from "./vercel";

export type { Storage, StoredObject, PutOpts } from "./types";

let _instance: Storage | null = null;

export function getStorage(): Storage {
  if (_instance) return _instance;
  const driver = (process.env.STORAGE_DRIVER ?? "filesystem").toLowerCase();
  if (driver === "vercel") {
    _instance = new VercelBlobStorage();
  } else if (driver === "filesystem") {
    _instance = new FilesystemStorage();
  } else {
    throw new Error(
      `Unknown STORAGE_DRIVER "${driver}" (expected "vercel" or "filesystem")`,
    );
  }
  return _instance;
}
