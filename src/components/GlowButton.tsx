"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface GlowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  glowColor?: string;
}

export const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, glowColor = "#E77630", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2 rounded-sm px-6 py-2.5 font-medium text-white transition-all duration-200",
          "bg-primary hover:bg-primary/90 active:bg-primary/80",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {/* glow effect */}
        <span
          className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
          style={{ backgroundColor: glowColor, transform: "scale(1.1)" }}
          aria-hidden
        />
        <span className="relative z-10 inline-flex items-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);

GlowButton.displayName = "GlowButton";
