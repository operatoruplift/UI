"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Search, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  group?: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
  className?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  items,
  placeholder = "Type a command or search...",
  className,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.group?.toLowerCase().includes(q)
    );
  }, [items, query]);

  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      const group = item.group ?? "";
      if (!map.has(group)) map.set(group, []);
      map.get(group)!.push(item);
    }
    return map;
  }, [filtered]);

  const flatItems = useMemo(() => filtered, [filtered]);

  useEffect(() => {
    setSelectedIndex(0);
    setQuery("");
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, flatItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && flatItems[selectedIndex]) {
        e.preventDefault();
        flatItems[selectedIndex].onSelect();
        onClose();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [flatItems, selectedIndex, onClose]
  );

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (!open) return null;

  let flatIdx = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div
        className={cn(
          "relative z-10 w-full max-w-lg rounded-xl border border-white/10 bg-[#0c0c0c] shadow-2xl overflow-hidden",
          className
        )}
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
          <Search className="h-5 w-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-500 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div ref={listRef} className="max-h-72 overflow-y-auto p-2">
          {flatItems.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-gray-500">No results found</div>
          ) : (
            Array.from(groups.entries()).map(([group, groupItems]) => (
              <div key={group}>
                {group && (
                  <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                    {group}
                  </p>
                )}
                {groupItems.map((item) => {
                  const idx = flatIdx++;
                  return (
                    <button
                      key={item.id}
                      data-index={idx}
                      onClick={() => {
                        item.onSelect();
                        onClose();
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        idx === selectedIndex
                          ? "bg-white/10 text-white"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {item.icon && <span className="shrink-0 w-5 h-5 flex items-center justify-center text-gray-400">{item.icon}</span>}
                      <span className="flex-1 text-left">
                        <span className="block">{item.label}</span>
                        {item.description && (
                          <span className="block text-xs text-gray-500">{item.description}</span>
                        )}
                      </span>
                      {item.shortcut && (
                        <kbd className="text-[10px] text-gray-600 font-mono">{item.shortcut}</kbd>
                      )}
                      {idx === selectedIndex && (
                        <CornerDownLeft className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-white/5 px-4 py-2 text-[10px] text-gray-600">
          <span className="inline-flex items-center gap-1"><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span className="inline-flex items-center gap-1"><kbd className="font-mono">↵</kbd> select</span>
          <span className="inline-flex items-center gap-1"><kbd className="font-mono">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
};
