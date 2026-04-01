"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useStreamingText } from "@/hooks/useStreamingText";

export interface StreamingTextProps {
  text: string;
  speed?: number;
  interval?: number;
  autoStart?: boolean;
  showCursor?: boolean;
  cursorChar?: string;
  onComplete?: () => void;
  className?: string;
}

export const StreamingText: React.FC<StreamingTextProps> = ({
  text,
  speed = 2,
  interval = 30,
  autoStart = true,
  showCursor = true,
  cursorChar = "▌",
  onComplete,
  className,
}) => {
  const { displayText, isStreaming, start } = useStreamingText(text, {
    speed,
    interval,
    onComplete,
  });

  useEffect(() => {
    if (autoStart) start();
  }, [autoStart, start]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && isStreaming && (
        <span className="animate-pulse text-primary">{cursorChar}</span>
      )}
    </span>
  );
};
