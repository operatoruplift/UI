"use client";

import React from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClipboard } from "@/hooks/useClipboard";

export interface CopyButtonProps {
  text: string;
  label?: string;
  size?: "sm" | "md";
  variant?: "ghost" | "outline";
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label,
  size = "sm",
  variant = "ghost",
  className,
}) => {
  const { copy, copied } = useClipboard();

  return (
    <button
      onClick={() => copy(text)}
      className={cn(
        "inline-flex items-center gap-1.5 transition-all",
        variant === "ghost" && "hover:bg-white/10 rounded p-1",
        variant === "outline" && "border border-white/10 hover:border-white/20 rounded-sm px-2 py-1",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        copied ? "text-green-400" : "text-gray-400 hover:text-white",
        className
      )}
      aria-label={copied ? "Copied" : "Copy"}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {label && <span>{copied ? "Copied!" : label}</span>}
    </button>
  );
};
