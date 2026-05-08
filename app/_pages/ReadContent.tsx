"use client";

import { useSearchParams } from "next/navigation";
import { ReadPage } from "../../src/read/ReadPage";

export default function ReadContent() {
  const searchParams = useSearchParams();
  const payload = searchParams.get("p") ?? undefined;
  const bookId = searchParams.get("b") ?? undefined;
  const preflightKey = searchParams.get("k") ?? undefined;
  return <ReadPage payload={payload} bookId={bookId} preflightKey={preflightKey} />;
}
