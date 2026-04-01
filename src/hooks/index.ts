export { useLocalStorage } from "./useLocalStorage";
export { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop } from "./useMediaQuery";
export { useDebounce, useDebouncedCallback } from "./useDebounce";
export { useClipboard } from "./useClipboard";
export type { UseClipboardOptions } from "./useClipboard";
export { useKeyboard, useHotkey } from "./useKeyboard";
export type { KeyCombo, KeyboardShortcut } from "./useKeyboard";
export { useOnClickOutside } from "./useOnClickOutside";
export { useStreamingText } from "./useStreamingText";
export type { UseStreamingTextOptions } from "./useStreamingText";
export { useCostTracker } from "./useCostTracker";
export type { TokenUsage, CostRate, UseCostTrackerOptions } from "./useCostTracker";

// Memory system
export { useMemory } from "./memory";
export type { UseMemoryOptions } from "./memory";
export { useMemoryConsolidation } from "./memory";
export type { UseMemoryConsolidationOptions } from "./memory";
export { createLocalStorageAdapter } from "./memory";
export type {
  MemoryType,
  MemoryEntry,
  MemoryTopicFile,
  MemoryIndex,
  MemorySearchResult,
  ConsolidationAction,
  MemoryStorageAdapter,
} from "./memory";
