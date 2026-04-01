"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface PermissionChipProps {
  icon: React.ReactNode;
  label: string;
  granted?: boolean;
  className?: string;
}

export const PermissionChip: React.FC<PermissionChipProps> = ({
  icon,
  label,
  granted = true,
  className,
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs",
        granted
          ? "border-green-500/20 bg-green-500/10 text-green-400"
          : "border-white/5 bg-white/5 text-gray-500",
        className
      )}
    >
      <span className="shrink-0 h-3.5 w-3.5 flex items-center justify-center">
        {icon}
      </span>
      {label}
    </span>
  );
};
