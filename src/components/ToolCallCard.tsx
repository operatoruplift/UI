"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Wrench, Check, X as XIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToolCallStatus = "running" | "success" | "error" | "pending";

export interface ToolCallCardProps {
  toolName: string;
  status?: ToolCallStatus;
  input?: Record<string, unknown> | string;
  output?: string;
  duration?: number;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

const statusIcon: Record<ToolCallStatus, React.ReactNode> = {
  running: <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />,
  success: <Check className="h-3.5 w-3.5 text-green-400" />,
  error: <XIcon className="h-3.5 w-3.5 text-red-400" />,
  pending: <div className="h-3.5 w-3.5 rounded-full border-2 border-gray-600" />,
};

export const ToolCallCard: React.FC<ToolCallCardProps> = ({
  toolName,
  status = "pending",
  input,
  output,
  duration,
  collapsible = true,
  defaultExpanded = false,
  className,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const inputStr = typeof input === "string" ? input : input ? JSON.stringify(input, null, 2) : undefined;

  return (
    <div className={cn("rounded-lg border border-white/5 bg-white/[0.02] overflow-hidden", className)}>
      <button
        onClick={() => collapsible && setExpanded(!expanded)}
        className={cn(
          "flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors",
          collapsible && "hover:bg-white/[0.03] cursor-pointer",
          !collapsible && "cursor-default"
        )}
      >
        {collapsible && (expanded ? <ChevronDown className="h-3.5 w-3.5 text-gray-500" /> : <ChevronRight className="h-3.5 w-3.5 text-gray-500" />)}
        <Wrench className="h-3.5 w-3.5 text-gray-400" />
        <span className="font-mono text-xs text-primary">{toolName}</span>
        <span className="flex-1" />
        {duration != null && (
          <span className="text-[10px] text-gray-600 font-mono">{duration}ms</span>
        )}
        {statusIcon[status]}
      </button>

      {expanded && (inputStr || output) && (
        <div className="border-t border-white/5">
          {inputStr && (
            <div className="px-3 py-2">
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Input</p>
              <pre className="text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap">{inputStr}</pre>
            </div>
          )}
          {output && (
            <div className={cn("px-3 py-2", inputStr && "border-t border-white/5")}>
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Output</p>
              <pre className={cn(
                "text-xs font-mono overflow-x-auto whitespace-pre-wrap",
                status === "error" ? "text-red-300" : "text-gray-300"
              )}>{output}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
