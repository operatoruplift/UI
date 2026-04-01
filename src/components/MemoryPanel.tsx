"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, Brain, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MemoryEntry, MemoryType } from "@/hooks/memory/types";
import { MemoryCard } from "./MemoryCard";

export interface MemoryPanelProps {
  entries: MemoryEntry[];
  /** Callback to fetch topic content for an entry (layer 2) */
  onFetchTopic?: (entry: MemoryEntry) => Promise<string | null>;
  onEdit?: (entry: MemoryEntry) => void;
  onDelete?: (entryId: string) => void;
  onCreate?: () => void;
  /** Active search handler (layer 3 - grep) */
  onSearch?: (query: string) => void;
  count?: number;
  atCapacity?: boolean;
  className?: string;
}

const memoryTypes: (MemoryType | "all")[] = ["all", "user", "feedback", "project", "reference"];

export const MemoryPanel: React.FC<MemoryPanelProps> = ({
  entries,
  onFetchTopic,
  onEdit,
  onDelete,
  onCreate,
  onSearch,
  count = 0,
  atCapacity = false,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<MemoryType | "all">("all");
  const [topicContent, setTopicContent] = useState<Map<string, string>>(new Map());
  const [loadingTopics, setLoadingTopics] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let result = entries;
    if (activeFilter !== "all") {
      result = result.filter((e) => e.type === activeFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [entries, activeFilter, searchQuery]);

  const handleFetchTopic = async (entry: MemoryEntry) => {
    if (topicContent.has(entry.id) || !onFetchTopic) return;
    setLoadingTopics((prev) => new Set([...prev, entry.id]));
    try {
      const content = await onFetchTopic(entry);
      if (content) {
        setTopicContent((prev) => new Map([...prev, [entry.id, content]]));
      }
    } finally {
      setLoadingTopics((prev) => {
        const next = new Set(prev);
        next.delete(entry.id);
        return next;
      });
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium text-white">Memory</h3>
          <span className="text-[10px] text-gray-500 font-mono">{count}</span>
          {atCapacity && (
            <span className="text-[10px] text-yellow-400 bg-yellow-400/10 rounded px-1 py-0.5">full</span>
          )}
        </div>
        {onCreate && (
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-1 rounded-sm px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        )}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
        <Search className="h-3.5 w-3.5 text-gray-500 shrink-0" />
        <input
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onSearch?.(e.target.value);
          }}
          placeholder="Search memories..."
          className="flex-1 bg-transparent text-xs text-white placeholder:text-gray-600 outline-none"
        />
      </div>

      {/* Type filter */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-white/5">
        <Filter className="h-3 w-3 text-gray-600 shrink-0" />
        {memoryTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={cn(
              "rounded px-2 py-0.5 text-[10px] transition-colors capitalize",
              activeFilter === type
                ? "bg-white/10 text-white"
                : "text-gray-500 hover:text-gray-300"
            )}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Memory list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Brain className="h-8 w-8 text-gray-700 mb-2" />
            <p className="text-xs text-gray-500">
              {searchQuery ? "No memories match your search" : "No memories stored yet"}
            </p>
          </div>
        ) : (
          filtered.map((entry) => (
            <MemoryCard
              key={entry.id}
              entry={entry}
              content={topicContent.get(entry.id)}
              loading={loadingTopics.has(entry.id)}
              onFetch={() => handleFetchTopic(entry)}
              onEdit={onEdit ? () => onEdit(entry) : undefined}
              onDelete={onDelete ? () => onDelete(entry.id) : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
};
