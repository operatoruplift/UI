/**
 * Memory system types.
 *
 * 3-layer architecture:
 *  1. Index   – always loaded, ~150 chars per entry (pointers only)
 *  2. Topics  – fetched on demand when a pointer is accessed
 *  3. History – never read directly, only searched/grep'd
 *
 * Key principles:
 *  - Memory = index, not storage
 *  - If it's derivable from code/git, don't persist it
 *  - Staleness is first-class: memory ≠ reality → memory is wrong
 *  - Write discipline: write file → then update index (never inline)
 *  - Retrieval is skeptical: memory is a hint, not truth
 */

export type MemoryType = "user" | "feedback" | "project" | "reference";

export interface MemoryEntry {
  /** Unique identifier */
  id: string;
  /** Short display name */
  name: string;
  /** One-line description used for relevance matching */
  description: string;
  /** Memory type classification */
  type: MemoryType;
  /** Relative path to the topic file */
  path: string;
  /** ISO timestamp of last update */
  updatedAt: string;
  /** ISO timestamp of creation */
  createdAt: string;
}

export interface MemoryTopicFile {
  /** Entry metadata (from frontmatter) */
  entry: MemoryEntry;
  /** Full content body */
  content: string;
}

export interface MemoryIndex {
  /** All memory pointers, sorted by relevance/recency */
  entries: MemoryEntry[];
  /** Max entries before forced truncation */
  maxEntries: number;
  /** Timestamp of last consolidation */
  lastConsolidated?: string;
}

/** Result of a memory search across all layers */
export interface MemorySearchResult {
  entry: MemoryEntry;
  /** Relevance score 0-1 */
  score: number;
  /** Matched snippet from content (if topic was fetched) */
  snippet?: string;
}

/** Consolidation action types for the autoDream process */
export type ConsolidationAction =
  | { type: "merge"; sourceIds: string[]; mergedEntry: MemoryEntry; mergedContent: string }
  | { type: "prune"; entryId: string; reason: string }
  | { type: "update"; entryId: string; updates: Partial<MemoryEntry>; newContent?: string }
  | { type: "dedupe"; keepId: string; removeIds: string[] };

/** Adapter interface for persistence backends (localStorage, filesystem, API, etc.) */
export interface MemoryStorageAdapter {
  /** Read the full index */
  readIndex(): Promise<MemoryIndex>;
  /** Write the full index (atomic) */
  writeIndex(index: MemoryIndex): Promise<void>;
  /** Read a topic file by path */
  readTopic(path: string): Promise<string | null>;
  /** Write a topic file */
  writeTopic(path: string, content: string): Promise<void>;
  /** Delete a topic file */
  deleteTopic(path: string): Promise<void>;
  /** Search across all topic files (grep-style) */
  searchTopics(query: string): Promise<MemorySearchResult[]>;
}
