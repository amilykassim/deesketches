export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="font-hand text-ink/40 text-lg animate-pulse">
        drawing…
      </span>
    </div>
  );
}
