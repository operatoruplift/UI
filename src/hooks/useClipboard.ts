"use client";

import { useState, useCallback, useRef } from "react";

export interface UseClipboardOptions {
  resetDelay?: number;
}

export function useClipboard({ resetDelay = 2000 }: UseClipboardOptions = {}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), resetDelay);
        return true;
      } catch {
        setCopied(false);
        return false;
      }
    },
    [resetDelay]
  );

  return { copy, copied };
}
