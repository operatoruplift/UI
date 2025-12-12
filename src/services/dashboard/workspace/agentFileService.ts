/**
 * Service for agent file operations (read, delete)
 */

import { getAgentDownloadPath } from '../hub/agentPathService';
import { checkElectronAPI, parseToolMessage } from './utils';

// Re-export for backward compatibility
export { parseToolMessage };

/**
 * Agent file data interface
 */
export interface AgentFileData {
  dataJson: any | null;
  dataJsonPath: string | null;
}

/**
 * Read agent data.json file
 * Works for both offline and online agents
 */
export const readAgentFiles = async (
  agentId: string,
): Promise<Record<string, any>> => {
  checkElectronAPI();

  const agentPath = await getAgentDownloadPath(agentId);
  const dataJsonPath = `${agentPath}/data.json`;

  const result: Record<string, any> = {
    dataJsonPath,
    dataJson: null,
  };

  try {
    const fileResult = await (window as any).electronAPI.readFile(dataJsonPath);
    if (fileResult.success && fileResult.content) {
      const dataJson = JSON.parse(fileResult.content);
      result.dataJson = dataJson;
      // Merge dynamic fields from dataJson into result
      Object.assign(result, dataJson);
    }
  } catch (error) {
    console.warn(`Error reading data.json for agent ${agentId}:`, error);
  }

  return result;
};

/**
 * Delete agent files from local storage
 */
export const deleteAgentFiles = async (agentId: string): Promise<void> => {
  checkElectronAPI();

  const agentPath = await getAgentDownloadPath(agentId);
  await (window as any).electronAPI.deleteDirectory(agentPath);
};

