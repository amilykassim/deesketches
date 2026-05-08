"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const handle = async () => {
    setPending(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  };
  return (
    <button
      type="button"
      onClick={handle}
      disabled={pending}
      className="font-ui text-sm text-ink/60 hover:text-sketchPink"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
