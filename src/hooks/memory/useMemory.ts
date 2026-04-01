"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type {
  MemoryEntry,
  MemoryIndex,
  MemoryTopicFile,
  MemoryType,
  MemorySearchResult,
  MemoryStorageAdapter,
} from "./types";

export interface UseMemoryOptions {
  adapter: MemoryStorageAdapter;
  /** Auto-load index on mount */
  autoLoad?: boolean;
}

/**
 * Core memory management hook.
 *
 * Implements the 3-layer memory architecture:
 *  - Index layer (always loaded)
 *  - Topic layer (on-demand fetch)
 *  - Search layer (grep across all topics)
 *
 * Write discipline: always write topic file FIRST, then update index.
 * This prevents orphaned index entries.
 */
export function useMemory({ adapter, autoLoad = true }: UseMemoryOptions) {
  const [index, setIndex] = useState<MemoryIndex>({ entries: [], maxEntries: 200 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const topicCache = useRef<Map<string, string>>(new Map());

  // Load index
  const loadIndex = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const idx = await adapter.readIndex();
      setIndex(idx);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load memory index");
    } finally {
      setLoading(false);
    }
  }, [adapter]);

  useEffect(() => {
    if (autoLoad) loadIndex();
  }, [autoLoad, loadIndex]);

  // Generate a slug-based path from name and type
  const generatePath = useCallback((name: string, type: MemoryType): string => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "")
      .slice(0, 40);
    return `${type}_${slug}.md`;
  }, []);

  /**
   * Save a memory. Write discipline:
   * 1. Write topic file
   * 2. Update index
   */
  const save = useCallback(
    async (opts: {
      name: string;
      description: string;
      type: MemoryType;
      content: string;
      /** If provided, updates an existing entry instead of creating */
      existingId?: string;
    }) => {
      setError(null);
      try {
        const now = new Date().toISOString();
        const path = generatePath(opts.name, opts.type);

        // Build frontmatter + content
        const fileContent = [
          "---",
          `name: ${opts.name}`,
          `description: ${opts.description}`,
          `type: ${opts.type}`,
          "---",
          "",
          opts.content,
        ].join("\n");

        // Step 1: Write topic file FIRST
        await adapter.writeTopic(path, fileContent);

        // Step 2: Update index
        const newIndex = { ...index };
        const existingIdx = opts.existingId
          ? newIndex.entries.findIndex((e) => e.id === opts.existingId)
          : newIndex.entries.findIndex((e) => e.path === path);

        const entry: MemoryEntry = {
          id: opts.existingId ?? `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          name: opts.name,
          description: opts.description,
          type: opts.type,
          path,
          updatedAt: now,
          createdAt: existingIdx >= 0 ? newIndex.entries[existingIdx].createdAt : now,
        };

        if (existingIdx >= 0) {
          newIndex.entries[existingIdx] = entry;
        } else {
          newIndex.entries.unshift(entry); // newest first
        }

        await adapter.writeIndex(newIndex);
        setIndex(newIndex);

        // Update cache
        topicCache.current.set(path, fileContent);

        return entry;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to save memory";
        setError(msg);
        throw new Error(msg);
      }
    },
    [adapter, index, generatePath]
  );

  /**
   * Fetch a topic file on demand (layer 2).
   * Results are cached to avoid redundant reads.
   */
  const fetchTopic = useCallback(
    async (entry: MemoryEntry): Promise<MemoryTopicFile | null> => {
      // Check cache first
      const cached = topicCache.current.get(entry.path);
      if (cached) {
        return { entry, content: extractContent(cached) };
      }

      const raw = await adapter.readTopic(entry.path);
      if (!raw) return null;

      topicCache.current.set(entry.path, raw);
      return { entry, content: extractContent(raw) };
    },
    [adapter]
  );

  /**
   * Delete a memory. Remove topic file, then update index.
   */
  const remove = useCallback(
    async (entryId: string) => {
      setError(null);
      try {
        const entry = index.entries.find((e) => e.id === entryId);
        if (!entry) return;

        // Delete topic file
        await adapter.deleteTopic(entry.path);

        // Update index
        const newIndex = {
          ...index,
          entries: index.entries.filter((e) => e.id !== entryId),
        };
        await adapter.writeIndex(newIndex);
        setIndex(newIndex);

        topicCache.current.delete(entry.path);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to delete memory");
      }
    },
    [adapter, index]
  );

  /**
   * Search across all memory layers.
   * Index match → immediate. Topic match → grep-style.
   */
  const search = useCallback(
    async (query: string): Promise<MemorySearchResult[]> => {
      if (!query.trim()) return [];
      return adapter.searchTopics(query);
    },
    [adapter]
  );

  /**
   * Get entries filtered by type.
   */
  const getByType = useCallback(
    (type: MemoryType): MemoryEntry[] => {
      return index.entries.filter((e) => e.type === type);
    },
    [index]
  );

  /**
   * Check if a memory with the given name/path already exists.
   * Prevents duplicates per the architecture spec.
   */
  const exists = useCallback(
    (name: string, type: MemoryType): MemoryEntry | undefined => {
      const path = generatePath(name, type);
      return index.entries.find((e) => e.path === path);
    },
    [index, generatePath]
  );

  return {
    index,
    loading,
    error,
    save,
    remove,
    search,
    fetchTopic,
    getByType,
    exists,
    reload: loadIndex,
    /** Total number of memories */
    count: index.entries.length,
    /** Whether index is at capacity */
    atCapacity: index.entries.length >= index.maxEntries,
  };
}

/** Extract body content from frontmatter-wrapped file */
function extractContent(raw: string): string {
  const match = raw.match(/^---\n[\s\S]*?\n---\n\n?([\s\S]*)$/);
  return match ? match[1].trim() : raw;
}
