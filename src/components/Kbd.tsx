import React from "react";
import { cn } from "@/lib/utils";

export interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

export const Kbd: React.FC<KbdProps> = ({ children, className }) => {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-gray-400",
        className
      )}
    >
      {children}
    </kbd>
  );
};

/** Renders a keyboard shortcut like "⌘K" from a string. */
export const Shortcut: React.FC<{ keys: string; className?: string }> = ({ keys, className }) => {
  const parts = keys.split("+").map((k) => k.trim());
  const symbols: Record<string, string> = {
    cmd: "⌘",
    meta: "⌘",
    ctrl: "⌃",
    alt: "⌥",
    option: "⌥",
    shift: "⇧",
    enter: "↵",
    backspace: "⌫",
    delete: "⌦",
    escape: "⎋",
    esc: "⎋",
    tab: "⇥",
    space: "␣",
    up: "↑",
    down: "↓",
    left: "←",
    right: "→",
  };

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {parts.map((part, i) => (
        <Kbd key={i}>{symbols[part.toLowerCase()] ?? part.toUpperCase()}</Kbd>
      ))}
    </span>
  );
};
