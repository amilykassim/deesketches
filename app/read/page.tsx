import { Suspense } from "react";
import ReadContent from "../_pages/ReadContent";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ReadContent />
    </Suspense>
  );
}
