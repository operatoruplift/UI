/**
 * Service for building agent API call functions
 */

import { readAgentFiles } from './agentFileService';

/**
 * Type for output callback
 */
export type OutputCallback = (line: string) => void;

/**
 * Make API call to agent service
 */
const makeAgentApiCall = async (
  port: number,
  endpoint: string,
  method: string = 'POST',
  body?: any
): Promise<any> => {
  const url = `http://localhost:${port}${endpoint}`;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.result;
};

/**
 * Build a command function that makes an API call
 */
const buildApiCommand = (
  port: number,
  commandDef: any,
  defaultEndpoint: string,
  defaultMethod: string = 'POST'
): ((accessToken?: string, query?: string) => Promise<any>) => {
  return async (accessToken?: string, query?: string) => {
    const endpoint = commandDef?.endpoint || defaultEndpoint;
    const method = commandDef?.method || defaultMethod;

    const body: any = {};
    if (accessToken) body.accessToken = accessToken;
    if (query) body.query = query;

    const result = await makeAgentApiCall(port, endpoint, method, body);

    return {
      success: true,
      stdout: typeof result === 'string' ? result : JSON.stringify(result),
      data: result,
    };
  };
};

/**
 * Read agent files and build API call functions
 */
export const buildAgentCommands = async (
  agentId: string,
): Promise<Record<string, (accessToken?: string, query?: string) => Promise<any>>> => {
  const fileData = await readAgentFiles(agentId);
  const dataJson = fileData.dataJson;

  if (!dataJson) {
    return {};
  }

  const commands: Record<string, (accessToken?: string, query?: string) => Promise<any>> = {};

  // Get port from dataJson
  const port = dataJson.port;
  if (!port) {
    console.warn(`No port found in agent data.json for agent ${agentId}`);
    return commands;
  }

  // Get commands from the commands object
  const commandDefs = dataJson.commands || {};

  // Build run command
  if (commandDefs.run) {
    commands.run = buildApiCommand(port, commandDefs.run, '/run');
  }

  // Build setup command
  if (commandDefs.setup) {
    commands.setup = buildApiCommand(port, commandDefs.setup, '/setup');
  }

  return commands;
};

/**
 * Read agent files and return complete data with commands
 */
export const readAgentFilesWithCommands = async (
  agentId: string,
): Promise<Record<string, any>> => {
  const fileData = await readAgentFiles(agentId);
  const commands = await buildAgentCommands(agentId);
  return {
    ...fileData,
    commands
  };
};

