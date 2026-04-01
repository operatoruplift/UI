import React from "react";
import { cn } from "@/lib/utils";

export interface TokenCounterProps {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
  maxTokens?: number;
  showBreakdown?: boolean;
  compact?: boolean;
  className?: string;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export const TokenCounter: React.FC<TokenCounterProps> = ({
  inputTokens,
  outputTokens,
  cacheReadTokens = 0,
  cacheWriteTokens = 0,
  maxTokens,
  showBreakdown = false,
  compact = false,
  className,
}) => {
  const total = inputTokens + outputTokens + cacheReadTokens + cacheWriteTokens;
  const percentage = maxTokens ? Math.min((total / maxTokens) * 100, 100) : undefined;

  if (compact) {
    return (
      <span className={cn("inline-flex items-center gap-1 text-xs text-gray-400 font-mono", className)}>
        {formatNumber(total)} tokens
      </span>
    );
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">Tokens</span>
        <span className="font-mono text-white">
          {formatNumber(total)}
          {maxTokens && <span className="text-gray-500"> / {formatNumber(maxTokens)}</span>}
        </span>
      </div>

      {percentage !== undefined && (
        <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              percentage > 90 ? "bg-red-400" : percentage > 70 ? "bg-yellow-400" : "bg-primary"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      {showBreakdown && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px]">
          <span className="text-gray-500">Input</span>
          <span className="text-right font-mono text-gray-300">{formatNumber(inputTokens)}</span>
          <span className="text-gray-500">Output</span>
          <span className="text-right font-mono text-gray-300">{formatNumber(outputTokens)}</span>
          {cacheReadTokens > 0 && (
            <>
              <span className="text-gray-500">Cache read</span>
              <span className="text-right font-mono text-gray-300">{formatNumber(cacheReadTokens)}</span>
            </>
          )}
          {cacheWriteTokens > 0 && (
            <>
              <span className="text-gray-500">Cache write</span>
              <span className="text-right font-mono text-gray-300">{formatNumber(cacheWriteTokens)}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
