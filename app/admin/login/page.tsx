"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error ?? `Error ${res.status}`);
        return;
      }
      router.push(from);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative z-20 min-h-screen pt-32 pb-20 px-5">
      <div className="max-w-sm mx-auto">
        <h1 className="font-display text-4xl mb-8 text-center">Admin</h1>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            autoFocus
            className="w-full bg-paper border border-ink/20 px-4 py-3 rounded-sm font-ui text-ink placeholder-ink/30 focus:outline-none focus:border-ink/50"
          />
          {error && (
            <p className="font-hand text-sketchPink text-sm">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-ui bg-ink text-paper px-5 py-3 rounded-full hover:bg-sketchPink pencil-cursor transition-colors disabled:opacity-50"
          >
            {loading ? "Checking…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
