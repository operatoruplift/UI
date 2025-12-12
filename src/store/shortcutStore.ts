/**
 * Shortcut commands handler
 * Handles special user commands like CLEAR_HISTORY
 */

import { useChatStore } from "./chatStore";

export interface ShortcutResult {
  handled: boolean;
  message?: string;
}

/**
 * Check if input is a shortcut command
 */
export const isShortcutCommand = (input: string): boolean => {
  return input.trim().toUpperCase() === 'CLEAR_HISTORY';
};

/**
 * Handle shortcut commands (shows message to user)
 */
export const handleShortcutCommand = (input: string): ShortcutResult => {
  const command = input.trim().toUpperCase();

  if (command === 'CLEAR_HISTORY') {
    return (clearChatHistory(true) as ShortcutResult) || { handled: false };
  }

  return { handled: false };
};

/**
 * Clear chat history from localStorage
 * @param showMessage - If true, returns ShortcutResult with message; if false, just clears silently
 */
export const clearChatHistory = (showMessage: boolean = true): ShortcutResult | void => {
  try {
    // Clear messages from localStorage
    const chatStoreKey = 'chat-storage';
    localStorage.removeItem(chatStoreKey);

    // Also clear any individual chat-related items
    const keysToRemove = Object.keys(localStorage).filter((key) =>
      key.includes('chat') || key.includes('message')
    );
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    useChatStore.getState().clearMessages()
    if (showMessage) {
      return {
        handled: true,
        message: '',
      };
    }
  } catch (error) {
    console.error('Error clearing chat history:', error);
    if (showMessage) {
      return {
        handled: true,
        message: '❌ Failed to clear chat history.',
      };
    }
  }
};

/**
 * Get all available shortcuts
 */
export const getAvailableShortcuts = (): string[] => {
  return ['CLEAR_HISTORY'];
};

