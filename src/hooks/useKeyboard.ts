"use client";

import { useEffect, useCallback } from "react";

export interface KeyCombo {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
}

export interface KeyboardShortcut {
  combo: KeyCombo;
  handler: (e: KeyboardEvent) => void;
  enabled?: boolean;
}

function matchesCombo(e: KeyboardEvent, combo: KeyCombo): boolean {
  return (
    e.key.toLowerCase() === combo.key.toLowerCase() &&
    !!e.ctrlKey === !!combo.ctrl &&
    !!e.metaKey === !!combo.meta &&
    !!e.shiftKey === !!combo.shift &&
    !!e.altKey === !!combo.alt
  );
}

export function useKeyboard(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        if (shortcut.enabled === false) continue;
        if (matchesCombo(e, shortcut.combo)) {
          e.preventDefault();
          shortcut.handler(e);
          return;
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [shortcuts]);
}

/**
 * Shorthand for a single keyboard shortcut.
 */
export function useHotkey(
  combo: KeyCombo,
  handler: (e: KeyboardEvent) => void,
  enabled = true
) {
  const stableHandler = useCallback(handler, [handler]);
  useKeyboard([{ combo, handler: stableHandler, enabled }]);
}
