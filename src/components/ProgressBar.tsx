"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value?: number; // 0-100, undefined = indeterminate
  color?: string;
  height?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

const heightClasses = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color,
  height = "md",
  label,
  className,
}) => {
  const indeterminate = value === undefined;
  const clamped = indeterminate ? 0 : Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs text-gray-400">{label}</span>
          {!indeterminate && (
            <span className="text-xs text-gray-500">{Math.round(clamped)}%</span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-white/10",
          heightClasses[height]
        )}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {indeterminate ? (
          <div
            className={cn("h-full w-1/4 rounded-full animate-progress-indeterminate", heightClasses[height])}
            style={{ backgroundColor: color || "var(--ou-primary)" }}
          />
        ) : (
          <div
            className={cn("h-full rounded-full transition-all duration-300", heightClasses[height])}
            style={{
              width: `${clamped}%`,
              backgroundColor: color || "var(--ou-primary)",
            }}
          />
        )}
      </div>
    </div>
  );
};
