"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  showCopy?: boolean;
  maxHeight?: number;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  filename,
  showLineNumbers = false,
  showCopy = true,
  maxHeight,
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-white/5 bg-black/40 overflow-hidden group",
        className
      )}
    >
      {/* Header */}
      {(filename || language || showCopy) && (
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
          <div className="flex items-center gap-2">
            {filename && (
              <span className="text-xs text-gray-400 font-mono">{filename}</span>
            )}
            {language && !filename && (
              <span className="text-xs text-gray-500">{language}</span>
            )}
          </div>
          {showCopy && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-all text-gray-400 hover:text-white"
              aria-label="Copy code"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>
      )}

      {/* Code */}
      <div
        className="overflow-x-auto"
        style={maxHeight ? { maxHeight, overflowY: "auto" } : undefined}
      >
        <pre className="p-4 text-xs font-mono text-gray-200 leading-relaxed">
          {showLineNumbers ? (
            <table className="border-collapse">
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="pr-4 text-right text-gray-600 select-none align-top w-8">
                      {i + 1}
                    </td>
                    <td className="whitespace-pre">{line || " "}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <code>{code}</code>
          )}
        </pre>
      </div>
    </div>
  );
};
