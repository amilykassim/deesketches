import { Suspense } from "react";
import { ReadPage } from "../../../src/read/ReadPage";

// Short, shareable read link: /r/<key>. Renders the same reader as /read,
// seeded with the key from the path so it auto-unlocks.
export default function Page({ params }: { params: { k: string } }) {
  return (
    <Suspense fallback={null}>
      <ReadPage initialKey={decodeURIComponent(params.k)} />
    </Suspense>
  );
}
