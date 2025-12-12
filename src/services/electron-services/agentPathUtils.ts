/**
 * Utility functions for agent paths in main process
 */

const path = require('path');
const fs = require('fs');
const { app } = require('electron');

/**
 * Get user data path
 */
export const getUserDataPath = (): string => {
  return app.getPath('userData');
};

/**
 * Get agents directory path
 */
export const getAgentsDirectoryPath = (): string => {
  return path.join(getUserDataPath(), 'agents');
};

/**
 * Get agent directory path by ID
 */
export const getAgentDirectoryPath = (agentId: string): string => {
  return path.join(getAgentsDirectoryPath(), agentId);
};

/**
 * Read agent data.json file (main process only)
 */
export const readAgentDataJsonSync = (agentPath: string): any | null => {
  try {
    const dataJsonPath = path.join(agentPath, 'data.json');
    if (!fs.existsSync(dataJsonPath)) {
      return null;
    }
    const content = fs.readFileSync(dataJsonPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading data.json for agent at ${agentPath}:`, error);
    return null;
  }
};

/**
 * Get all installed agent IDs by scanning the agents directory
 */
export const getInstalledAgentIds = (): string[] => {
  try {
    const agentsPath = getAgentsDirectoryPath();
    
    if (!fs.existsSync(agentsPath)) {
      return [];
    }

    return fs.readdirSync(agentsPath, { withFileTypes: true })
      .filter((dirent: any) => dirent.isDirectory())
      .map((dirent: any) => dirent.name);
  } catch (error) {
    console.error('Error getting installed agent IDs:', error);
    return [];
  }
};

