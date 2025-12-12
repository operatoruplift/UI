/**
 * Service for managing agent state in localStorage
 */

const STORAGE_KEY_PREFIX = 'agent_state_';

export interface AgentState {
  assist: boolean;
  installed: boolean;
  watcherPid?: number; // Process ID of the watcher agent
}

/**
 * Get agent state from localStorage
 */
export const getAgentState = (agentId: string): AgentState => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${agentId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Error reading agent state:', error);
  }
  return { assist: false, installed: false, watcherPid: undefined };
};

/**
 * Set agent state in localStorage
 */
export const setAgentState = (agentId: string, state: Partial<AgentState>): void => {
  try {
    const current = getAgentState(agentId);
    const updated = { ...current, ...state };
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${agentId}`, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving agent state:', error);
  }
};


/**
 * Set installed state
 */
export const setInstalled = (agentId: string, installed: boolean): void => {
  setAgentState(agentId, { installed });
};

/**
 * Clear agent state from localStorage (used when uninstalling)
 */
export const clearAgentState = (agentId: string): void => {
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${agentId}`);
  } catch (error) {
    console.error('Error clearing agent state:', error);
  }
};

