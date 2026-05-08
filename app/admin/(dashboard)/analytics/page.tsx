import { Suspense } from "react";
import { AnalyticsClient } from "../../_components/AnalyticsClient";

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<p className="font-hand text-ink/55">Loading…</p>}>
      <AnalyticsClient />
    </Suspense>
  );
}
