export type PutOpts = {
  contentType?: string;
};

export type StoredObject = {
  key: string;
  url: string;
};

export interface Storage {
  put(key: string, body: Buffer | Blob, opts?: PutOpts): Promise<StoredObject>;
  get(key: string): Promise<Buffer | null>;
  list(prefix: string): Promise<StoredObject[]>;
  delete(key: string): Promise<void>;
  getUrl(key: string): Promise<string>;
}
