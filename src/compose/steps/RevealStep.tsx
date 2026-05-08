import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Payload } from "../../lib/payload";
import { RoughBox } from "../../components/RoughBox";
import { Doodle } from "../../components/Doodle";
import { ConfettiBurst } from "../../components/ConfettiBurst";

type Chapter = { title: string; body: string };

type Props = {
  payload: Payload;
  secretKey: string;
  storySource: "self" | "magic_writer";
  arcId: string | null;
  chapters: Chapter[];
  audioClipId: string | null;
  onChangeKey?: () => void;
};

type CreateState =
  | { status: "creating" }
  | { status: "ready"; url: string; bookId: string }
  | { status: "error"; message: string };

export function RevealStep({
  payload,
  secretKey,
  storySource,
  arcId,
  chapters,
  audioClipId,
  onChangeKey,
}: Props) {
  const [confettiKey, setConfettiKey] = useState(0);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [create, setCreate] = useState<CreateState>({ status: "creating" });

  useEffect(() => {
    setConfettiKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            k: payload.k,
            format: payload.format,
            category: payload.category,
            cardIds: payload.cardIds,
            sender: payload.sender,
            recipient: payload.recipient,
            storySource,
            storyArcId: arcId,
            chapters,
            audioClipId,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          if (!cancelled) {
            setCreate({
              status: "error",
              message: err?.error ?? `Server error (${res.status})`,
            });
          }
          return;
        }
        const json = (await res.json()) as { id: string; k: string };
        const url = `${window.location.origin}/read?b=${json.id}&k=${encodeURIComponent(secretKey)}`;
        if (!cancelled) setCreate({ status: "ready", url, bookId: json.id });
      } catch (e) {
        if (!cancelled) {
          setCreate({
            status: "error",
            message: e instanceof Error ? e.message : "Network error",
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [payload, secretKey, storySource, arcId, chapters, audioClipId]);

  const copy = async (text: string, set: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      set(true);
      setTimeout(() => set(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <section className="text-center">
      <ConfettiBurst trigger={confettiKey} />
      <div className="flex justify-center gap-3 mb-4">
        <Doodle kind="star" color="#F6C667" size={24} drift={3.5} />
        <Doodle kind="heart" color="#FF4D8D" size={24} drift={4} />
        <Doodle kind="spark" color="#4A90E2" size={24} drift={3} />
      </div>
      <h1 className="font-display text-5xl mb-2">It's ready.</h1>
      <p className="font-hand text-lg text-ink/70 mb-10">
        Share the password (or the link) with {payload.recipient}.
      </p>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="relative bg-paper p-8 mx-auto max-w-xl"
        style={{ transform: "rotate(-1deg)" }}
      >
        <RoughBox seed={101} roughness={1.9} strokeWidth={1.8} />
        <div className="font-ui text-xs uppercase tracking-wider text-ink/55 mb-2">
          Password
        </div>
        <div className="font-display text-5xl text-ink tracking-wide select-all break-all">
          {secretKey}
        </div>
        <button
          type="button"
          onClick={() => copy(secretKey, setCopiedKey)}
          className="font-ui text-sm text-ink/60 hover:text-sketchPink mt-4 pencil-cursor"
        >
          {copiedKey ? "✓ copied" : "Copy password"}
        </button>
      </motion.div>

      <div className="mt-8 max-w-2xl mx-auto">
        <div className="font-ui text-xs uppercase tracking-wider text-ink/55 mb-2">
          Or send the link
        </div>
        {create.status === "creating" && (
          <div className="bg-paper border border-ink/15 px-4 py-3 rounded-sm font-ui text-sm text-ink/55">
            Saving your card…
          </div>
        )}
        {create.status === "error" && create.message === "Key already in use" && (
          <div className="bg-paper border border-sketchPink/40 px-4 py-3 rounded-sm font-ui text-sm text-sketchPink">
            That password is already taken — pick another.
            {onChangeKey && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={onChangeKey}
                  className="font-ui bg-ink text-paper px-5 py-2 rounded-full hover:bg-sketchPink pencil-cursor transition-colors"
                >
                  Choose a different password
                </button>
              </div>
            )}
          </div>
        )}
        {create.status === "error" && create.message !== "Key already in use" && (
          <div className="bg-paper border border-sketchPink/40 px-4 py-3 rounded-sm font-ui text-sm text-sketchPink">
            Couldn't save: {create.message}
          </div>
        )}
        {create.status === "ready" && (
          <>
            <div className="bg-paper border border-ink/15 px-4 py-3 rounded-sm font-ui text-sm text-ink/80 break-all">
              {create.url}
            </div>
            <div className="flex gap-3 justify-center mt-4">
              <button
                type="button"
                onClick={() => copy(create.url, setCopiedLink)}
                className="font-ui bg-ink text-paper px-5 py-2 rounded-full hover:bg-sketchPink pencil-cursor transition-colors"
              >
                {copiedLink ? "✓ copied" : "Copy link"}
              </button>
              <a
                href={create.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-ui border border-ink/30 px-5 py-2 rounded-full hover:bg-ink/5 pencil-cursor transition-colors"
              >
                Preview as recipient ↗
              </a>
            </div>
          </>
        )}
      </div>

      <p className="font-hand text-sm text-ink/55 mt-10">
        Heads up — the recipient needs both the link and the password.
      </p>
    </section>
  );
}
