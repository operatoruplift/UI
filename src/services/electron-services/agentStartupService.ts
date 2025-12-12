/**
 * Service for starting installed agent executables on app startup
 */

const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const {
  getAgentsDirectoryPath,
  getAgentDirectoryPath,
  readAgentDataJsonSync,
  getInstalledAgentIds,
} = require('./agentPathUtils');

/**
 * Start an agent executable as a background process
 */
const startAgentExecutable = (agentId: string, agentPath: string, executableFilename: string): void => {
  try {
    const executablePath = path.join(agentPath, executableFilename);
    
    // Check if executable exists
    if (!fs.existsSync(executablePath)) {
      console.warn(`Executable not found for agent ${agentId}: ${executablePath}`);
      return;
    }

    const isWindows = process.platform === 'win32';
    
    // Spawn the process as detached background process
    const spawnOptions: any = {
      cwd: agentPath,
      detached: true,
      stdio: 'ignore',
    };

    if (isWindows) {
      spawnOptions.shell = true;
    }

    const child = spawn(executablePath, [], spawnOptions);
    
    // Unref the process so it runs independently
    child.unref();
    
    console.log(`✅ Started agent ${agentId} executable: ${executableFilename} (PID: ${child.pid})`);
  } catch (error) {
    console.error(`Error starting agent ${agentId} executable:`, error);
  }
};

/**
 * Start a specific agent executable
 */
export const startAgentOnInstall = (agentId: string): void => {
  try {
    const agentPath = getAgentDirectoryPath(agentId);
    const dataJson = readAgentDataJsonSync(agentPath);

    if (!dataJson) {
      console.warn(`No data.json found for agent ${agentId}`);
      return;
    }

    const executableFilename = dataJson.executable_filename;
    if (!executableFilename) {
      console.log(`No executable_filename found for agent ${agentId}, skipping`);
      return;
    }

    startAgentExecutable(agentId, agentPath, executableFilename);
  } catch (error) {
    console.error(`Error starting agent ${agentId}:`, error);
  }
};

/**
 * Start all installed agent executables
 */
export const startInstalledAgentExecutables = (): void => {
  try {
    const agentsPath = getAgentsDirectoryPath();

    // Check if agents directory exists
    if (!fs.existsSync(agentsPath)) {
      console.log('No agents directory found, skipping agent startup');
      return;
    }

    const agentIds = getInstalledAgentIds();
    console.log(`Found ${agentIds.length} installed agent(s), checking for executables...`);

    let startedCount = 0;

    // Process each agent
    agentIds.forEach((agentId: string) => {
      try {
        const agentPath = getAgentDirectoryPath(agentId);
        const dataJson = readAgentDataJsonSync(agentPath);

        if (!dataJson) {
          console.warn(`No data.json found for agent ${agentId}`);
          return;
        }

        // Check for executable_filename
        const executableFilename = dataJson.executable_filename;
        if (!executableFilename) {
          console.log(`No executable_filename found for agent ${agentId}, skipping`);
          return;
        }

        // Start the executable
        startAgentExecutable(agentId, agentPath, executableFilename);
        startedCount++;
      } catch (error) {
        console.error(`Error processing agent ${agentId}:`, error);
      }
    });

    console.log(`✅ Started ${startedCount} agent executable(s) on startup`);
  } catch (error) {
    console.error('Error starting installed agent executables:', error);
  }
};

