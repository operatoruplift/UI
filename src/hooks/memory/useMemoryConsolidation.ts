"use client";

import { useCallback, useRef } from "react";
import type {
  MemoryEntry,
  MemoryIndex,
  MemoryStorageAdapter,
  ConsolidationAction,
} from "./types";

export interface UseMemoryConsolidationOptions {
  adapter: MemoryStorageAdapter;
  /** Called when consolidation produces actions. Implement to apply AI-driven merging. */
  onActions?: (actions: ConsolidationAction[]) => Promise<void>;
}

/**
 * Memory consolidation hook (the "autoDream" pattern).
 *
 * Runs in isolation (should be called from a background process or subagent).
 * Limited capabilities by design to prevent context corruption.
 *
 * Actions:
 *  - Merge: combine related entries into one
 *  - Dedupe: remove duplicates, keep best version
 *  - Prune: remove stale/contradicted memories
 *  - Update: convert vague → absolute, refresh descriptions
 */
export function useMemoryConsolidation({
  adapter,
  onActions,
}: UseMemoryConsolidationOptions) {
  const runningRef = useRef(false);

  /**
   * Find duplicate entries based on path or high name similarity.
   */
  const findDuplicates = useCallback(
    (entries: MemoryEntry[]): ConsolidationAction[] => {
      const actions: ConsolidationAction[] = [];
      const seen = new Map<string, MemoryEntry>();

      for (const entry of entries) {
        const existing = seen.get(entry.path);
        if (existing) {
          // Keep the more recently updated one
          const keep = existing.updatedAt > entry.updatedAt ? existing : entry;
          const remove = keep === existing ? entry : existing;
          actions.push({
            type: "dedupe",
            keepId: keep.id,
            removeIds: [remove.id],
          });
          seen.set(entry.path, keep);
        } else {
          seen.set(entry.path, entry);
        }
      }

      return actions;
    },
    []
  );

  /**
   * Find entries that should be pruned based on age and type.
   * Project memories decay faster than user/feedback memories.
   */
  const findStale = useCallback(
    (entries: MemoryEntry[], maxAgeDays: Record<string, number> = {}): ConsolidationAction[] => {
      const defaults: Record<string, number> = {
        project: 30,
        reference: 90,
        feedback: 180,
        user: 365,
      };
      const limits = { ...defaults, ...maxAgeDays };
      const now = Date.now();
      const actions: ConsolidationAction[] = [];

      for (const entry of entries) {
        const ageDays = (now - new Date(entry.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
        const maxAge = limits[entry.type] ?? 90;

        if (ageDays > maxAge) {
          actions.push({
            type: "prune",
            entryId: entry.id,
            reason: `Stale: ${Math.round(ageDays)} days old (max ${maxAge} for ${entry.type})`,
          });
        }
      }

      return actions;
    },
    []
  );

  /**
   * Run a full consolidation pass.
   * Returns proposed actions without applying them.
   */
  const consolidate = useCallback(async (): Promise<ConsolidationAction[]> => {
    if (runningRef.current) return [];
    runningRef.current = true;

    try {
      const index = await adapter.readIndex();
      const actions: ConsolidationAction[] = [];

      // Phase 1: Find duplicates
      actions.push(...findDuplicates(index.entries));

      // Phase 2: Find stale entries
      actions.push(...findStale(index.entries));

      return actions;
    } finally {
      runningRef.current = false;
    }
  }, [adapter, findDuplicates, findStale]);

  /**
   * Apply a set of consolidation actions to the memory store.
   */
  const applyActions = useCallback(
    async (actions: ConsolidationAction[]) => {
      const index = await adapter.readIndex();
      let entries = [...index.entries];

      for (const action of actions) {
        switch (action.type) {
          case "prune":
            {
              const entry = entries.find((e) => e.id === action.entryId);
              if (entry) await adapter.deleteTopic(entry.path);
              entries = entries.filter((e) => e.id !== action.entryId);
            }
            break;

          case "dedupe":
            for (const removeId of action.removeIds) {
              const entry = entries.find((e) => e.id === removeId);
              if (entry) await adapter.deleteTopic(entry.path);
            }
            entries = entries.filter((e) => !action.removeIds.includes(e.id));
            break;

          case "merge":
            {
              // Remove source entries
              for (const sourceId of action.sourceIds) {
                const entry = entries.find((e) => e.id === sourceId);
                if (entry) await adapter.deleteTopic(entry.path);
              }
              entries = entries.filter((e) => !action.sourceIds.includes(e.id));
              // Add merged entry
              await adapter.writeTopic(action.mergedEntry.path, action.mergedContent);
              entries.unshift(action.mergedEntry);
            }
            break;

          case "update":
            {
              const idx = entries.findIndex((e) => e.id === action.entryId);
              if (idx >= 0) {
                entries[idx] = { ...entries[idx], ...action.updates, updatedAt: new Date().toISOString() };
                if (action.newContent) {
                  await adapter.writeTopic(entries[idx].path, action.newContent);
                }
              }
            }
            break;
        }
      }

      const newIndex: MemoryIndex = {
        ...index,
        entries,
        lastConsolidated: new Date().toISOString(),
      };
      await adapter.writeIndex(newIndex);

      if (onActions) await onActions(actions);
    },
    [adapter, onActions]
  );

  /**
   * Run consolidation and apply results in one step.
   */
  const run = useCallback(async (): Promise<ConsolidationAction[]> => {
    const actions = await consolidate();
    if (actions.length > 0) {
      await applyActions(actions);
    }
    return actions;
  }, [consolidate, applyActions]);

  return {
    consolidate,
    applyActions,
    run,
    isRunning: runningRef.current,
  };
}
