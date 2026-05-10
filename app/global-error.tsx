"use client";

import { useEffect } from "react";

// Top-level error boundary — fires when the root layout itself crashes,
// so the Shell/fonts/CSS aren't available. Keep the markup minimal and
// inline-styled so it works even if globals.css failed to load.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#fbf7f0",
          color: "#1a1a1a",
          fontFamily: "Georgia, 'Times New Roman', serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            textAlign: "center",
            background: "#fff",
            border: "1.5px solid #1a1a1a",
            padding: "32px",
            transform: "rotate(-0.6deg)",
            boxShadow: "8px 10px 0 rgba(26,26,26,0.08)",
          }}
        >
          <h1 style={{ fontSize: 48, margin: "0 0 12px", lineHeight: 1 }}>
            Oof.
          </h1>
          <p style={{ fontSize: 18, margin: "0 0 8px", color: "#1a1a1aaa" }}>
            The whole studio tipped over for a sec.
          </p>
          <p style={{ fontSize: 14, margin: "0 0 24px", color: "#1a1a1a99" }}>
            Try a refresh. And if it sticks around, drop us a note.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#1a1a1a",
              color: "#fbf7f0",
              border: "none",
              padding: "10px 20px",
              borderRadius: 999,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
