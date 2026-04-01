import type { MemoryIndex, MemorySearchResult, MemoryStorageAdapter } from "./types";

const DEFAULT_INDEX: MemoryIndex = { entries: [], maxEntries: 200 };

/**
 * LocalStorage-based memory adapter.
 * Stores index + topic files in localStorage with a namespace prefix.
 * Suitable for browser-based apps (website, desktop via Tauri).
 */
export function createLocalStorageAdapter(namespace = "ou-memory"): MemoryStorageAdapter {
  const indexKey = `${namespace}:index`;
  const topicPrefix = `${namespace}:topic:`;

  return {
    async readIndex(): Promise<MemoryIndex> {
      try {
        const raw = localStorage.getItem(indexKey);
        return raw ? (JSON.parse(raw) as MemoryIndex) : { ...DEFAULT_INDEX };
      } catch {
        return { ...DEFAULT_INDEX };
      }
    },

    async writeIndex(index: MemoryIndex): Promise<void> {
      // Enforce max entries (truncate oldest)
      if (index.entries.length > index.maxEntries) {
        index.entries = index.entries.slice(0, index.maxEntries);
      }
      localStorage.setItem(indexKey, JSON.stringify(index));
    },

    async readTopic(path: string): Promise<string | null> {
      return localStorage.getItem(topicPrefix + path);
    },

    async writeTopic(path: string, content: string): Promise<void> {
      localStorage.setItem(topicPrefix + path, content);
    },

    async deleteTopic(path: string): Promise<void> {
      localStorage.removeItem(topicPrefix + path);
    },

    async searchTopics(query: string): Promise<MemorySearchResult[]> {
      const results: MemorySearchResult[] = [];
      const q = query.toLowerCase();
      const index = await this.readIndex();

      for (const entry of index.entries) {
        // Score based on name/description match
        let score = 0;
        const nameMatch = entry.name.toLowerCase().includes(q);
        const descMatch = entry.description.toLowerCase().includes(q);
        if (nameMatch) score += 0.6;
        if (descMatch) score += 0.4;

        // Check topic content if index didn't match well enough
        if (score < 0.3) {
          const content = await this.readTopic(entry.path);
          if (content?.toLowerCase().includes(q)) {
            score = 0.3;
            const idx = content.toLowerCase().indexOf(q);
            const start = Math.max(0, idx - 40);
            const end = Math.min(content.length, idx + q.length + 40);
            results.push({
              entry,
              score,
              snippet: (start > 0 ? "..." : "") + content.slice(start, end) + (end < content.length ? "..." : ""),
            });
            continue;
          }
        }

        if (score > 0) {
          results.push({ entry, score });
        }
      }

      return results.sort((a, b) => b.score - a.score);
    },
  };
}
