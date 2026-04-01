"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Trash2, Edit2, User, MessageSquare, Folder, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MemoryEntry, MemoryType } from "@/hooks/memory/types";

export interface MemoryCardProps {
  entry: MemoryEntry;
  content?: string;
  onFetch?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  loading?: boolean;
  className?: string;
}

const typeIcons: Record<MemoryType, React.ReactNode> = {
  user: <User className="h-3.5 w-3.5" />,
  feedback: <MessageSquare className="h-3.5 w-3.5" />,
  project: <Folder className="h-3.5 w-3.5" />,
  reference: <Link className="h-3.5 w-3.5" />,
};

const typeColors: Record<MemoryType, string> = {
  user: "text-blue-400 bg-blue-400/10",
  feedback: "text-yellow-400 bg-yellow-400/10",
  project: "text-green-400 bg-green-400/10",
  reference: "text-purple-400 bg-purple-400/10",
};

export const MemoryCard: React.FC<MemoryCardProps> = ({
  entry,
  content,
  onFetch,
  onEdit,
  onDelete,
  loading = false,
  className,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    if (!expanded && !content && onFetch) {
      onFetch(); // On-demand fetch (layer 2)
    }
    setExpanded(!expanded);
  };

  const age = getAge(entry.updatedAt);

  return (
    <div className={cn("rounded-lg border border-white/5 bg-white/[0.02] overflow-hidden", className)}>
      <button
        onClick={handleToggle}
        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-white/[0.03] transition-colors"
      >
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-gray-500 shrink-0" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-gray-500 shrink-0" />
        )}

        {/* Type badge */}
        <span className={cn("inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium", typeColors[entry.type])}>
          {typeIcons[entry.type]}
          {entry.type}
        </span>

        {/* Name */}
        <span className="text-white font-medium truncate flex-1 text-left">{entry.name}</span>

        {/* Age */}
        <span className="text-[10px] text-gray-600 shrink-0">{age}</span>
      </button>

      {/* Description (always visible as pointer) */}
      <div className="px-3 pb-2 -mt-0.5">
        <p className="text-xs text-gray-500 truncate pl-6">{entry.description}</p>
      </div>

      {/* Expanded content (layer 2 - on demand) */}
      {expanded && (
        <div className="border-t border-white/5 px-3 py-3">
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-600 border-t-primary" />
              Fetching memory...
            </div>
          ) : content ? (
            <div className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">{content}</div>
          ) : (
            <p className="text-xs text-gray-600 italic">No content available</p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 mt-3 pt-2 border-t border-white/5">
            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Edit2 className="h-3 w-3" /> Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-colors"
              >
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function getAge(isoDate: string): string {
  const ms = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  return `${months}mo`;
}
