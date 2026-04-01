"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  autoResize?: boolean;
  maxRows?: number;
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, autoResize = false, maxRows = 10, label, ...props }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) ?? internalRef;

    const resize = useCallback(() => {
      const el = textareaRef.current;
      if (!el || !autoResize) return;
      el.style.height = "auto";
      const lineHeight = parseInt(getComputedStyle(el).lineHeight, 10) || 20;
      const maxHeight = lineHeight * maxRows;
      el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    }, [autoResize, maxRows, textareaRef]);

    useEffect(() => {
      resize();
    }, [props.value, resize]);

    return (
      <div>
        {label && <label className="block text-sm text-gray-400 mb-1.5">{label}</label>}
        <textarea
          ref={textareaRef}
          onInput={autoResize ? resize : undefined}
          className={cn(
            "flex w-full rounded-sm border bg-white/5 px-3 py-2 text-sm text-white",
            "placeholder:text-gray-500 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary/50",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-none",
            error ? "border-red-500/50" : "border-white/5 hover:border-white/10 focus:border-primary/30",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
