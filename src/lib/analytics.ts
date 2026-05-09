import { and, between, count, countDistinct, desc, eq, lt, sql } from "drizzle-orm";
import { db, events } from "./db";

export type Range = { from: Date; to: Date };

export function parseRange(searchParams: URLSearchParams): Range {
  const fromRaw = searchParams.get("from");
  const toRaw = searchParams.get("to");
  if (fromRaw && toRaw) {
    const from = new Date(fromRaw);
    const to = new Date(toRaw);
    if (!Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime())) {
      return { from, to };
    }
  }
  const preset = searchParams.get("range") ?? "30d";
  const days =
    preset === "7d" ? 7 : preset === "90d" ? 90 : preset === "30d" ? 30 : 30;
  const to = new Date();
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
  return { from, to };
}

export function previousRange(r: Range): Range {
  const span = r.to.getTime() - r.from.getTime();
  return { from: new Date(r.from.getTime() - span), to: r.from };
}

const cache = new Map<string, { at: number; value: unknown }>();
const TTL_MS = 5 * 60 * 1000;

async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.value as T;
  const value = await fn();
  cache.set(key, { at: Date.now(), value });
  return value;
}

function rangeKey(r: Range): string {
  return `${r.from.toISOString()}|${r.to.toISOString()}`;
}

// All analytics now read from `events.metadata` directly. The book row that
// used to hold sender/category/etc. lives in Redis with a 7d TTL; events are
// the only durable source of historical context.
const META_SENDER = sql<string>`${events.metadata}->>'sender'`;
const META_CATEGORY = sql<string>`${events.metadata}->>'category'`;
const META_STORY_SOURCE = sql<string>`${events.metadata}->>'storySource'`;

async function countCreated(r: Range): Promise<number> {
  const [row] = await db
    .select({ n: count() })
    .from(events)
    .where(
      and(
        eq(events.type, "book_created"),
        between(events.createdAt, r.from, r.to),
      ),
    );
  return Number(row?.n ?? 0);
}

async function countUniqueSenders(r: Range): Promise<number> {
  const [row] = await db
    .select({ n: countDistinct(META_SENDER) })
    .from(events)
    .where(
      and(
        eq(events.type, "book_created"),
        between(events.createdAt, r.from, r.to),
      ),
    );
  return Number(row?.n ?? 0);
}

async function countDistinctEventBooks(type: string, r: Range): Promise<number> {
  const [row] = await db
    .select({ n: countDistinct(events.bookId) })
    .from(events)
    .where(
      and(eq(events.type, type), between(events.createdAt, r.from, r.to)),
    );
  return Number(row?.n ?? 0);
}

async function countEvents(type: string, r: Range): Promise<number> {
  const [row] = await db
    .select({ n: count() })
    .from(events)
    .where(
      and(eq(events.type, type), between(events.createdAt, r.from, r.to)),
    );
  return Number(row?.n ?? 0);
}

async function magicWriterRate(r: Range): Promise<{ total: number; magic: number }> {
  const [totalRow] = await db
    .select({ n: count() })
    .from(events)
    .where(
      and(
        eq(events.type, "book_created"),
        between(events.createdAt, r.from, r.to),
      ),
    );
  const [magicRow] = await db
    .select({ n: count() })
    .from(events)
    .where(
      and(
        eq(events.type, "book_created"),
        eq(META_STORY_SOURCE, "magic_writer"),
        between(events.createdAt, r.from, r.to),
      ),
    );
  return { total: Number(totalRow?.n ?? 0), magic: Number(magicRow?.n ?? 0) };
}

export type Kpis = {
  range: { from: string; to: string };
  metrics: {
    booksCreated: { value: number; previous: number };
    uniqueSenders: { value: number; previous: number };
    booksOpened: { value: number; previous: number };
    booksCompleted: { value: number; previous: number };
    giftBackClicks: { value: number; previous: number };
    magicWriterRate: { value: number; magicCount: number; total: number; previous: number };
  };
};

export async function getKpis(r: Range): Promise<Kpis> {
  return cached(`kpis:${rangeKey(r)}`, async () => {
    const prev = previousRange(r);
    const [
      bc,
      bcPrev,
      us,
      usPrev,
      bo,
      boPrev,
      bcomp,
      bcompPrev,
      gb,
      gbPrev,
      mw,
      mwPrev,
    ] = await Promise.all([
      countCreated(r),
      countCreated(prev),
      countUniqueSenders(r),
      countUniqueSenders(prev),
      countDistinctEventBooks("book_opened", r),
      countDistinctEventBooks("book_opened", prev),
      countDistinctEventBooks("book_completed", r),
      countDistinctEventBooks("book_completed", prev),
      countEvents("gift_back_clicked", r),
      countEvents("gift_back_clicked", prev),
      magicWriterRate(r),
      magicWriterRate(prev),
    ]);

    const rate = mw.total === 0 ? 0 : mw.magic / mw.total;
    const prevRate = mwPrev.total === 0 ? 0 : mwPrev.magic / mwPrev.total;

    return {
      range: { from: r.from.toISOString(), to: r.to.toISOString() },
      metrics: {
        booksCreated: { value: bc, previous: bcPrev },
        uniqueSenders: { value: us, previous: usPrev },
        booksOpened: { value: bo, previous: boPrev },
        booksCompleted: { value: bcomp, previous: bcompPrev },
        giftBackClicks: { value: gb, previous: gbPrev },
        magicWriterRate: {
          value: rate,
          magicCount: mw.magic,
          total: mw.total,
          previous: prevRate,
        },
      },
    };
  });
}

export type TimeseriesPoint = { day: string; count: number };

export async function getTimeseries(r: Range): Promise<TimeseriesPoint[]> {
  return cached(`timeseries:${rangeKey(r)}`, async () => {
    const rows = await db
      .select({
        day: sql<string>`to_char(date_trunc('day', ${events.createdAt}), 'YYYY-MM-DD')`,
        n: count(),
      })
      .from(events)
      .where(
        and(
          eq(events.type, "book_created"),
          between(events.createdAt, r.from, r.to),
        ),
      )
      .groupBy(sql`date_trunc('day', ${events.createdAt})`)
      .orderBy(sql`date_trunc('day', ${events.createdAt})`);
    return rows.map((row) => ({ day: row.day, count: Number(row.n) }));
  });
}

export type Breakdowns = {
  byCategory: { category: string; count: number }[];
  magicWriterByCategory: { category: string; count: number }[];
};

export async function getBreakdowns(r: Range): Promise<Breakdowns> {
  return cached(`breakdowns:${rangeKey(r)}`, async () => {
    const [byCategory, magicCats] = await Promise.all([
      db
        .select({ category: META_CATEGORY, n: count() })
        .from(events)
        .where(
          and(
            eq(events.type, "book_created"),
            between(events.createdAt, r.from, r.to),
          ),
        )
        .groupBy(META_CATEGORY)
        .orderBy(desc(count())),
      db
        .select({ category: META_CATEGORY, n: count() })
        .from(events)
        .where(
          and(
            eq(events.type, "book_created"),
            eq(META_STORY_SOURCE, "magic_writer"),
            between(events.createdAt, r.from, r.to),
          ),
        )
        .groupBy(META_CATEGORY)
        .orderBy(desc(count())),
    ]);

    return {
      byCategory: byCategory
        .filter((r) => r.category)
        .map((r) => ({ category: r.category as string, count: Number(r.n) })),
      magicWriterByCategory: magicCats
        .filter((r) => r.category)
        .map((r) => ({ category: r.category as string, count: Number(r.n) })),
    };
  });
}

export type FeedItem = {
  id: number;
  type: string;
  bookId: string | null;
  bookTitle: string | null;
  sender: string | null;
  recipient: string | null;
  createdAt: string;
};

export async function getFeed(cursorId: number | null, limit = 50): Promise<{
  items: FeedItem[];
  nextCursor: number | null;
}> {
  const conds = cursorId !== null ? lt(events.id, cursorId) : undefined;
  const rows = await db
    .select({
      id: events.id,
      type: events.type,
      bookId: events.bookId,
      metadata: events.metadata,
      createdAt: events.createdAt,
    })
    .from(events)
    .where(conds)
    .orderBy(desc(events.id))
    .limit(limit + 1);
  const hasMore = rows.length > limit;
  const items = rows.slice(0, limit).map((r) => {
    const meta = (r.metadata as Record<string, unknown> | null) ?? {};
    const sender = typeof meta.sender === "string" ? meta.sender : null;
    const recipient = typeof meta.recipient === "string" ? meta.recipient : null;
    return {
      id: Number(r.id),
      type: r.type,
      bookId: r.bookId ?? null,
      bookTitle: sender && recipient ? `${sender} → ${recipient}` : null,
      sender,
      recipient,
      createdAt: r.createdAt.toISOString(),
    };
  });
  const nextCursor = hasMore ? items[items.length - 1].id : null;
  return { items, nextCursor };
}
