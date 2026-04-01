"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface UseStreamingTextOptions {
  /** Characters per tick */
  speed?: number;
  /** Ms between ticks */
  interval?: number;
  /** Callback when streaming completes */
  onComplete?: () => void;
}

export function useStreamingText(
  fullText: string,
  { speed = 2, interval = 30, onComplete }: UseStreamingTextOptions = {}
) {
  const [displayText, setDisplayText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const start = useCallback(() => {
    indexRef.current = 0;
    setDisplayText("");
    setIsStreaming(true);

    timerRef.current = setInterval(() => {
      indexRef.current += speed;
      if (indexRef.current >= fullText.length) {
        setDisplayText(fullText);
        setIsStreaming(false);
        clearInterval(timerRef.current);
        onComplete?.();
      } else {
        setDisplayText(fullText.slice(0, indexRef.current));
      }
    }, interval);
  }, [fullText, speed, interval, onComplete]);

  const skip = useCallback(() => {
    clearInterval(timerRef.current);
    setDisplayText(fullText);
    setIsStreaming(false);
    onComplete?.();
  }, [fullText, onComplete]);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setDisplayText("");
    setIsStreaming(false);
    indexRef.current = 0;
  }, []);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return { displayText, isStreaming, start, skip, reset };
}
