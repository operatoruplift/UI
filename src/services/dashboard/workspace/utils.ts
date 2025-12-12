/**
 * Shared utilities for workspace services
 */

/**
 * Check if Electron API is available
 */
export const checkElectronAPI = (): void => {
  if (typeof window === 'undefined' || !(window as any).electronAPI) {
    throw new Error('Electron API not available');
  }
};

/**
 * Get user ID from auth store
 */
export const getUserId = (): string => {
  const { useAuthStore } = require('@/store/authStore');
  const userId = useAuthStore.getState().user?.id;
  if (!userId) {
    throw new Error('User not authenticated');
  }
  return userId;
};

/**
 * Parse error message from various error types
 */
export const parseErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error occurred';
};

/**
 * Parse tool message from string
 * Format: [Tool:tool_id]: message text
 */
export function parseToolMessage(message: string): { tool_id: string | null; text: string } {
  const regex = /\[Tool:([^\]]+)\]:\s*(.*)/s;
  const match = message.match(regex);

  if (!match) {
    return { tool_id: null, text: message.trim() };
  }

  return {
    tool_id: match[1],
    text: match[2].trim(),
  };
}

