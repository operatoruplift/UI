import React from "react";
import { cn } from "@/lib/utils";

export type StatusDotStatus = "online" | "offline" | "busy" | "away" | "running" | "error" | "idle";

export interface StatusDotProps {
  status: StatusDotStatus;
  label?: string;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
  className?: string;
}

const colorMap: Record<StatusDotStatus, string> = {
  online: "bg-green-400",
  running: "bg-green-400",
  offline: "bg-gray-500",
  idle: "bg-gray-500",
  busy: "bg-red-400",
  error: "bg-red-400",
  away: "bg-yellow-400",
};

const sizeMap = {
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
};

export const StatusDot: React.FC<StatusDotProps> = ({
  status,
  label,
  size = "md",
  animate,
  className,
}) => {
  const shouldAnimate = animate ?? (status === "running" || status === "online");

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="relative inline-flex">
        <span className={cn("rounded-full", colorMap[status], sizeMap[size])} />
        {shouldAnimate && (
          <span
            className={cn(
              "absolute inset-0 rounded-full animate-ping",
              colorMap[status],
              "opacity-40"
            )}
          />
        )}
      </span>
      {label && <span className="text-xs text-gray-400">{label}</span>}
    </span>
  );
};
