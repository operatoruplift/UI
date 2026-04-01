import React from "react";
import { cn } from "@/lib/utils";

export interface DividerProps {
  label?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  label,
  orientation = "horizontal",
  className,
}) => {
  if (orientation === "vertical") {
    return <div className={cn("w-px self-stretch bg-white/5", className)} />;
  }

  if (label) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-xs text-gray-500 shrink-0">{label}</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>
    );
  }

  return <div className={cn("h-px w-full bg-white/5", className)} />;
};
