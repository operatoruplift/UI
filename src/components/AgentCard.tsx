"use client";

import React from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";

export type AgentStatus = "running" | "idle" | "error";

export interface AgentCardProps {
  name: string;
  avatar?: React.ReactNode;
  status?: AgentStatus;
  model?: string;
  description?: string;
  onInstall?: () => void;
  installed?: boolean;
  className?: string;
}

const statusColors: Record<AgentStatus, string> = {
  running: "bg-green-400",
  idle: "bg-gray-500",
  error: "bg-red-400",
};

const statusLabels: Record<AgentStatus, string> = {
  running: "Running",
  idle: "Idle",
  error: "Error",
};

export const AgentCard: React.FC<AgentCardProps> = ({
  name,
  avatar,
  status = "idle",
  model,
  description,
  onInstall,
  installed = false,
  className,
}) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/5 bg-card p-4 transition-colors hover:border-white/10",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* avatar */}
        <div className="relative shrink-0">
          {avatar ? (
            <div className="h-10 w-10 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center text-lg">
              {avatar}
            </div>
          ) : (
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          {/* status dot */}
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
              statusColors[status],
              status === "running" && "animate-dot-pulse"
            )}
            title={statusLabels[status]}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-white truncate">{name}</h4>
            {model && <Badge size="sm">{model}</Badge>}
          </div>
          {description && (
            <p className="mt-1 text-sm text-gray-400 line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {onInstall && (
          <button
            onClick={onInstall}
            disabled={installed}
            className={cn(
              "shrink-0 flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors",
              installed
                ? "bg-white/5 text-gray-500 cursor-default"
                : "bg-primary text-white hover:bg-primary/90"
            )}
          >
            {installed ? (
              "Installed"
            ) : (
              <>
                <Download className="h-3 w-3" />
                Install
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
