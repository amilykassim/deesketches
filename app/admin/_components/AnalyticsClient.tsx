"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Kpis = {
  range: { from: string; to: string };
  metrics: {
    booksCreated: { value: number; previous: number };
    uniqueSenders: { value: number; previous: number };
    booksOpened: { value: number; previous: number };
    booksCompleted: { value: number; previous: number };
    giftBackClicks: { value: number; previous: number };
    magicWriterRate: {
      value: number;
      magicCount: number;
      total: number;
      previous: number;
    };
  };
};

type Timeseries = { points: { day: string; count: number }[] };

type Breakdowns = {
  byCategory: { category: string; count: number }[];
  audioTopClips: { id: string; title: string; count: number }[];
  audioAttachRate: { withAudio: number; total: number };
  magicWriterByCategory: { category: string; count: number }[];
};

type Feed = {
  items: {
    id: number;
    type: string;
    bookId: string | null;
    bookTitle: string | null;
    createdAt: string;
  }[];
  nextCursor: number | null;
};

const CHART_COLORS = ["#FF4D8D", "#4A90E2", "#F6C667", "#6FCF97", "#FF8A3C", "#1a1a1a"];

export function AnalyticsClient() {
  const router = useRouter();
  const params = useSearchParams();
  const range = params.get("range") ?? "30d";

  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [timeseries, setTimeseries] = useState<Timeseries | null>(null);
  const [breakdowns, setBreakdowns] = useState<Breakdowns | null>(null);
  const [feed, setFeed] = useState<Feed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setRange = (r: string) => {
    const next = new URLSearchParams(params);
    next.set("range", r);
    router.replace(`/admin/analytics?${next.toString()}`);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const qs = new URLSearchParams(params).toString();
    Promise.all([
      fetch(`/api/admin/analytics/kpis?${qs}`).then((r) => r.json()),
      fetch(`/api/admin/analytics/timeseries?${qs}`).then((r) => r.json()),
      fetch(`/api/admin/analytics/breakdowns?${qs}`).then((r) => r.json()),
      fetch(`/api/admin/analytics/feed`).then((r) => r.json()),
    ])
      .then(([k, t, b, f]) => {
        if (cancelled) return;
        setKpis(k);
        setTimeseries(t);
        setBreakdowns(b);
        setFeed(f);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [params]);

  return (
    <div className="space-y-12">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-3xl">Analytics</h1>
        <div className="flex gap-2 font-ui text-sm">
          {(["7d", "30d", "90d"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-full border ${
                range === r
                  ? "bg-ink text-paper border-ink"
                  : "border-ink/20 text-ink/70 hover:bg-ink/5"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </header>

      {error && <p className="font-hand text-sketchPink">{error}</p>}

      {kpis && (
        <section>
          <h2 className="font-ui text-xs uppercase tracking-wider text-ink/50 mb-3">
            Headline
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <KpiCard label="Books created" value={kpis.metrics.booksCreated.value} previous={kpis.metrics.booksCreated.previous} />
            <KpiCard label="Unique senders" value={kpis.metrics.uniqueSenders.value} previous={kpis.metrics.uniqueSenders.previous} />
            <KpiCard label="Books opened" value={kpis.metrics.booksOpened.value} previous={kpis.metrics.booksOpened.previous} />
            <KpiCard label="Books completed" value={kpis.metrics.booksCompleted.value} previous={kpis.metrics.booksCompleted.previous} />
            <KpiCard label="Gift-back clicks" value={kpis.metrics.giftBackClicks.value} previous={kpis.metrics.giftBackClicks.previous} />
            <KpiCard
              label="Magic Writer rate"
              value={kpis.metrics.magicWriterRate.value}
              previous={kpis.metrics.magicWriterRate.previous}
              isRate
              suffix={`(${kpis.metrics.magicWriterRate.magicCount}/${kpis.metrics.magicWriterRate.total})`}
            />
          </div>
        </section>
      )}

      {timeseries && (
        <section>
          <h2 className="font-ui text-xs uppercase tracking-wider text-ink/50 mb-3">
            Books created per day
          </h2>
          <div className="h-64 bg-paper border border-ink/10 rounded-sm p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeseries.points}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a22" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#FF4D8D"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {breakdowns && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Panel title="Books by category">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdowns.byCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a22" />
                  <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4A90E2">
                    {breakdowns.byCategory.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Top audio clips">
            {breakdowns.audioTopClips.length === 0 ? (
              <p className="font-hand text-ink/60 text-sm">No clips attached yet.</p>
            ) : (
              <ul className="text-sm space-y-1 font-ui">
                {breakdowns.audioTopClips.map((c) => (
                  <li key={c.id} className="flex justify-between">
                    <span className="truncate">{c.title}</span>
                    <span className="text-ink/60">{c.count}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-ink/55 font-ui">
              {breakdowns.audioAttachRate.total > 0
                ? `${Math.round(
                    (breakdowns.audioAttachRate.withAudio / breakdowns.audioAttachRate.total) * 100,
                  )}% of books include audio (${breakdowns.audioAttachRate.withAudio}/${breakdowns.audioAttachRate.total})`
                : "No books in this range."}
            </p>
          </Panel>

          <Panel title="Magic Writer by category">
            {breakdowns.magicWriterByCategory.length === 0 ? (
              <p className="font-hand text-ink/60 text-sm">No Magic Writer drafts in range.</p>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={breakdowns.magicWriterByCategory}
                      dataKey="count"
                      nameKey="category"
                      outerRadius={80}
                      label
                    >
                      {breakdowns.magicWriterByCategory.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </Panel>
        </section>
      )}

      {feed && (
        <section>
          <h2 className="font-ui text-xs uppercase tracking-wider text-ink/50 mb-3">
            Recent activity
          </h2>
          <ul className="divide-y divide-ink/10 border border-ink/10 rounded-sm">
            {feed.items.map((it) => (
              <li
                key={it.id}
                className="px-4 py-2 text-sm font-ui flex justify-between gap-4"
              >
                <span>
                  <span className="text-ink/55">{prettyType(it.type)}</span>
                  {it.bookTitle && (
                    <span className="ml-2 text-ink/85">{it.bookTitle}</span>
                  )}
                </span>
                <span className="text-ink/50">
                  {new Date(it.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
            {feed.items.length === 0 && (
              <li className="px-4 py-3 text-ink/55 font-hand">No events yet.</li>
            )}
          </ul>
        </section>
      )}

      {loading && <p className="font-hand text-ink/55">Loading…</p>}
    </div>
  );
}

function prettyType(t: string): string {
  return t.replace(/_/g, " ");
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-paper border border-ink/10 rounded-sm p-4">
      <h3 className="font-ui text-xs uppercase tracking-wider text-ink/50 mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function KpiCard({
  label,
  value,
  previous,
  isRate,
  suffix,
}: {
  label: string;
  value: number;
  previous: number;
  isRate?: boolean;
  suffix?: string;
}) {
  const delta = previous === 0 ? null : ((value - previous) / previous) * 100;
  const display = isRate ? `${Math.round(value * 100)}%` : value.toLocaleString();
  return (
    <div className="bg-paper border border-ink/10 rounded-sm p-4">
      <div className="font-ui text-xs uppercase tracking-wider text-ink/50">
        {label}
      </div>
      <div className="font-display text-3xl mt-1">{display}</div>
      <div className="font-ui text-xs text-ink/55 mt-1">
        {delta === null
          ? "—"
          : `${delta >= 0 ? "▲" : "▼"} ${Math.abs(delta).toFixed(0)}% vs prev`}
        {suffix ? ` · ${suffix}` : ""}
      </div>
    </div>
  );
}
