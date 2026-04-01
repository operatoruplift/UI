"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  width,
  height,
  className,
  style,
  ...props
}) => {
  const variantClasses: Record<string, string> = {
    text: "h-4 rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={cn(
        "animate-skeleton-shimmer bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%]",
        variantClasses[variant],
        className
      )}
      style={{
        width: width ?? (variant === "circular" ? 40 : "100%"),
        height:
          height ??
          (variant === "circular" ? 40 : variant === "rectangular" ? 100 : undefined),
        ...style,
      }}
      {...props}
    />
  );
};
