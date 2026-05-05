import { useEffect, useState } from "react";

type Props = {
  text: string;
  /** ms per word */
  speed?: number;
  /** ms before starting */
  delay?: number;
  className?: string;
  onDone?: () => void;
};

export function Typewriter({
  text,
  speed = 90,
  delay = 0,
  className = "",
  onDone,
}: Props) {
  const [count, setCount] = useState(0);
  const words = text.split(/(\s+)/);
  const visibleWords = words.length;
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduceMotion) {
      setCount(visibleWords);
      onDone?.();
      return;
    }
    setCount(0);
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;
    const start = () => {
      let i = 0;
      const tick = () => {
        if (cancelled) return;
        i += 1;
        setCount(i);
        if (i < visibleWords) {
          timer = setTimeout(tick, speed);
        } else {
          onDone?.();
        }
      };
      timer = setTimeout(tick, speed);
    };
    const startTimer = setTimeout(start, delay);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearTimeout(startTimer);
    };
  }, [text, speed, delay, visibleWords, reduceMotion, onDone]);

  return (
    <span className={className}>
      {words.slice(0, count).join("")}
      {count < visibleWords && (
        <span className="inline-block w-[2px] h-[1em] align-[-0.15em] bg-ink/70 ml-0.5 animate-pulse" />
      )}
    </span>
  );
}
