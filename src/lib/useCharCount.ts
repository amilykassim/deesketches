import { useMemo } from "react";

export type CharCount = {
  count: number;
  max: number;
  near: boolean;
  over: boolean;
  remaining: number;
};

export function useCharCount(value: string, max: number, threshold = 0.8): CharCount {
  return useMemo(() => {
    const count = value.length;
    return {
      count,
      max,
      near: count >= max * threshold,
      over: count > max,
      remaining: max - count,
    };
  }, [value, max, threshold]);
}
