"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatBubbleProps {
  role: "user" | "assistant";
  content: React.ReactNode;
  timestamp?: string;
  avatar?: React.ReactNode;
  showCopy?: boolean;
  rawContent?: string;
  className?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  role,
  content,
  timestamp,
  avatar,
  showCopy = true,
  rawContent,
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";

  const handleCopy = async () => {
    const text = rawContent || (typeof content === "string" ? content : "");
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex gap-3 group",
        isUser && "flex-row-reverse",
        className
      )}
    >
      {avatar && (
        <div className="shrink-0 mt-1">
          <div className="h-8 w-8 rounded-full overflow-hidden bg-white/5 flex items-center justify-center text-xs">
            {avatar}
          </div>
        </div>
      )}

      <div
        className={cn(
          "relative max-w-[80%] rounded-xl px-4 py-3 text-sm",
          isUser
            ? "bg-primary/20 text-white"
            : "bg-white/5 text-gray-200"
        )}
      >
        {/* prose content area for markdown */}
        <div
          className={cn(
            "prose prose-sm prose-invert max-w-none",
            "[&_pre]:bg-black/40 [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:overflow-x-auto",
            "[&_code]:text-primary [&_code]:text-xs",
            "[&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1"
          )}
        >
          {content}
        </div>

        {/* copy button */}
        {showCopy && (rawContent || typeof content === "string") && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-all text-gray-400 hover:text-white"
            aria-label="Copy message"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        )}

        {timestamp && (
          <p className="mt-1 text-[10px] text-gray-500">{timestamp}</p>
        )}
      </div>
    </div>
  );
};
