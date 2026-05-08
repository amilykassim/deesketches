# tinnynotes

## Develop

```bash
pnpm install
pnpm dev
```

## Environment

Copy `.env.example` to `.env.local` and fill in. Without these, only the marketing pages render.

| Var | Required for | Notes |
| --- | --- | --- |
| `POSTGRES_URL` | Compose / Read flows, admin, analytics | Vercel Postgres / Neon connection string. Local dev: point at a Neon dev branch or local Postgres. |
| `STORAGE_DRIVER` | Audio uploads, future binary assets | `vercel` or `filesystem` (default). |
| `BLOB_READ_WRITE_TOKEN` | When `STORAGE_DRIVER=vercel` | Required by `@vercel/blob`. |
| `ADMIN_PASSWORD` | `/admin` access | Single shared admin password. (Phase 2) |
| `ADMIN_SESSION_SECRET` | Admin session signing | HMAC key for admin cookies. (Phase 2) |

## Storage

Binary assets (audio clips, future images) flow through one storage interface that can run in two modes:

- **`STORAGE_DRIVER=filesystem`** (default) — files live under `./.storage/<key>` and are served by `/storage/<key>` in dev. Zero external setup; great for first-clone development.
- **`STORAGE_DRIVER=vercel`** — files go to Vercel Blob via `@vercel/blob`. Requires `BLOB_READ_WRITE_TOKEN`. Production / preview deployments use this.

Feature code never imports a driver directly. Always:

```ts
import { getStorage } from "@/lib/storage";
const storage = getStorage();
await storage.put("audio/abc.mp3", buffer, { contentType: "audio/mpeg" });
```

`./.storage/` is gitignored.

## Database

Drizzle ORM over `@vercel/postgres`. Schema lives in [src/lib/db/schema.ts](src/lib/db/schema.ts).

```bash
pnpm db:push      # apply schema to the database POSTGRES_URL points at
pnpm db:generate  # generate a migration from schema changes
pnpm db:studio    # open Drizzle Studio
```

Structured records (books, events, audio metadata, admin sessions) go to Postgres — *not* to the storage abstraction. Only binary blobs use storage.
