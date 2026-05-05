import { useEffect, useState } from "react";

export type Route =
  | { name: "home" }
  | { name: "compose" }
  | { name: "read"; payload?: string };

function parse(): Route {
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw || raw === "/" || raw === "top") return { name: "home" };
  if (raw.startsWith("/compose")) return { name: "compose" };
  if (raw.startsWith("/read")) {
    const q = raw.split("?")[1] ?? "";
    const params = new URLSearchParams(q);
    const p = params.get("p") ?? undefined;
    return { name: "read", payload: p };
  }
  return { name: "home" };
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parse());
  useEffect(() => {
    const onHash = () => setRoute(parse());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}

export function navigate(to: string) {
  window.location.hash = to;
  window.scrollTo({ top: 0, behavior: "auto" });
}
