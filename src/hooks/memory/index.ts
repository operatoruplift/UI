export type {
  MemoryType,
  MemoryEntry,
  MemoryTopicFile,
  MemoryIndex,
  MemorySearchResult,
  ConsolidationAction,
  MemoryStorageAdapter,
} from "./types";

export { useMemory } from "./useMemory";
export type { UseMemoryOptions } from "./useMemory";

export { useMemoryConsolidation } from "./useMemoryConsolidation";
export type { UseMemoryConsolidationOptions } from "./useMemoryConsolidation";

export { createLocalStorageAdapter } from "./localStorageAdapter";
