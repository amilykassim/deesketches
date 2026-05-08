import { useEffect, useMemo, useState } from "react";
import { decodePayload } from "../lib/payload";
import { pickStoryFromKey } from "../lib/story";
import { sketches } from "../data/sketches";
import type { Category } from "../data/sketches";
import { KeyEntryStep } from "./KeyEntryStep";
import { StoryReader, type ReaderChapter } from "./StoryReader";

type Props = {
  payload?: string;
  bookId?: string;
  preflightKey?: string;
};

type ServerBook = {
  id: string;
  format: "digital" | "physical";
  category: Category;
  cardIds: string[];
  sender: string;
  recipient: string;
  storySource: "self" | "magic_writer" | "legacy_arc";
  storyArcId: string | null;
  chapters: ReaderChapter[];
  audio: { id: string; title: string; mood: string | null; url: string; durationSec: number } | null;
};

type Loaded =
  | { source: "legacy"; title: string; sender: string; recipient: string; secretKey: string; pairs: { sketch: ReturnType<typeof findSketch>; chapter: ReaderChapter | undefined }[]; bookId: null; audioUrl: null }
  | { source: "server"; bookId: string; title: string; sender: string; recipient: string; secretKey: string; pairs: { sketch: ReturnType<typeof findSketch>; chapter: ReaderChapter | undefined }[]; audioUrl: string | null };

function findSketch(id: string) {
  return sketches.find((s) => s.id === id);
}

export function ReadPage({ payload, bookId, preflightKey }: Props) {
  const decoded = useMemo(() => (payload ? decodePayload(payload) : null), [payload]);

  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    if (!loaded || loaded.source !== "server") return;
    const flagKey = `tn_seen_book_opened_${loaded.bookId}`;
    if (typeof window !== "undefined" && !window.localStorage.getItem(flagKey)) {
      window.localStorage.setItem(flagKey, "1");
      fetch("/api/events/book-opened", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: loaded.bookId }),
      }).catch(() => {});
    }
  }, [loaded]);

  const unlockLegacy = (k: string) => {
    if (!decoded) return;
    const story = pickStoryFromKey(decoded.category, decoded.k, decoded.cardIds.length);
    if (!story) {
      setUnlockError("Could not load this story.");
      return;
    }
    const pairs = decoded.cardIds.map((id, i) => ({
      sketch: findSketch(id),
      chapter: story.chapters[i],
    }));
    setLoaded({
      source: "legacy",
      title: story.arcTitle,
      sender: decoded.sender,
      recipient: decoded.recipient,
      secretKey: k,
      pairs,
      bookId: null,
      audioUrl: null,
    });
  };

  const unlockServer = async (id: string, k: string) => {
    setUnlocking(true);
    setUnlockError(null);
    try {
      const res = await fetch(`/api/books/${id}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ k }),
      });
      if (res.status === 401) {
        setUnlockError("That password doesn't match. Double-check with the sender?");
        return;
      }
      if (!res.ok) {
        setUnlockError(`Server error (${res.status})`);
        return;
      }
      const book = (await res.json()) as ServerBook;
      const pairs = book.cardIds.map((cid, i) => ({
        sketch: findSketch(cid),
        chapter: book.chapters[i],
      }));
      setLoaded({
        source: "server",
        bookId: book.id,
        title: book.chapters[0]?.title ?? "A little something",
        sender: book.sender,
        recipient: book.recipient,
        secretKey: k,
        pairs,
        audioUrl: book.audio?.url ?? null,
      });
    } catch (e) {
      setUnlockError(e instanceof Error ? e.message : "Network error");
    } finally {
      setUnlocking(false);
    }
  };

  // Auto-unlock if we have a server bookId + key from query string.
  useEffect(() => {
    if (loaded || !bookId || !preflightKey) return;
    void unlockServer(bookId, preflightKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, preflightKey]);

  if (loaded) {
    return (
      <main className="relative z-20 min-h-screen">
        <StoryReader
          title={loaded.title}
          sender={loaded.sender}
          recipient={loaded.recipient}
          secretKey={loaded.secretKey}
          pairs={loaded.pairs}
          bookId={loaded.bookId}
          audioUrl={loaded.audioUrl}
        />
      </main>
    );
  }

  return (
    <main className="relative z-20 pt-28 pb-32 min-h-screen">
      <div className="max-w-2xl mx-auto px-5">
        <KeyEntryStep
          hasPayload={!!payload || !!bookId}
          decoded={decoded}
          mode={bookId ? "server" : "legacy"}
          loading={unlocking}
          serverError={unlockError}
          onUnlock={(typedKey) => {
            setUnlockError(null);
            if (bookId) {
              void unlockServer(bookId, typedKey);
            } else if (decoded) {
              unlockLegacy(typedKey);
            }
          }}
        />
      </div>
    </main>
  );
}
