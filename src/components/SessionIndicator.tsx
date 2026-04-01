"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SessionIndicatorProps {
  count: number;
  className?: string;
}

export const SessionIndicator: React.FC<SessionIndicatorProps> = ({
  count,
  className,
}) => {
  const active = count > 0;

  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-xs", className)}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          active ? "bg-green-400 animate-dot-pulse" : "bg-gray-600"
        )}
      />
      <span className={active ? "text-green-400" : "text-gray-500"}>
        {count} session{count !== 1 ? "s" : ""}
      </span>
    </span>
  );
};
