"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy" | "away";
  className?: string;
}

const sizeMap = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const statusColorMap = {
  online: "bg-green-400",
  offline: "bg-gray-500",
  busy: "bg-red-400",
  away: "bg-yellow-400",
};

const statusSizeMap = {
  xs: "h-1.5 w-1.5 border",
  sm: "h-2 w-2 border",
  md: "h-2.5 w-2.5 border-2",
  lg: "h-3 w-3 border-2",
  xl: "h-3.5 w-3.5 border-2",
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "",
  fallback,
  size = "md",
  status,
  className,
}) => {
  const initials = fallback
    ? fallback
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn("rounded-full object-cover bg-white/5", sizeMap[size])}
        />
      ) : (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-primary/20 text-primary font-semibold",
            sizeMap[size]
          )}
        >
          {initials}
        </span>
      )}
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-card",
            statusColorMap[status],
            statusSizeMap[size]
          )}
        />
      )}
    </span>
  );
};
