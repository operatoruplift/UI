/**
 * IPC handlers for process execution and management
 */

const path = require("path");

/**
 * Register IPC handlers for process operations
 */
export const registerProcessHandlers = (ipcMain: any) => {
  // Execute command
  ipcMain.handle("execute-command", async (_event: any, command: string, options?: { cwd?: string; detached?: boolean }) => {
    return new Promise((resolve, reject) => {
      try {
        const { spawn } = require('child_process');
        const isWindows = process.platform === 'win32';
        
        // Parse command and arguments
        const parts = command.trim().split(/\s+/);
        const executable = parts[0];
        const args = parts.slice(1);
        
        // Normalize working directory path
        const workingDir = options?.cwd ? path.normalize(options.cwd) : process.cwd();
        
        // Use shell on Windows, direct execution on Unix
        const spawnOptions: any = {
          cwd: workingDir,
          detached: options?.detached !== false,
          stdio: options?.detached ? 'ignore' : 'pipe',
        };

        if (isWindows) {
          spawnOptions.shell = true;
        }

        const child = spawn(executable, args, spawnOptions);

        if (options?.detached) {
          // Detach the process so it runs independently
          child.unref();
          resolve({ success: true, pid: child.pid });
        } else {
          let stdout = '';
          let stderr = '';

          child.stdout?.on('data', (data: Buffer) => {
            stdout += data.toString();
          });

          child.stderr?.on('data', (data: Buffer) => {
            stderr += data.toString();
          });

          child.on('close', (code: number) => {
            if (code === 0) {
              resolve({ success: true, stdout, stderr, code });
            } else {
              reject({ success: false, stdout, stderr, code, error: `Process exited with code ${code}` });
            }
          });

          child.on('error', (error: any) => {
            reject({ success: false, error: error.message });
          });
        }
      } catch (error: any) {
        reject({ success: false, error: error.message });
      }
    });
  });

  // Kill process by PID
  ipcMain.handle("kill-process", async (_event: any, pid: number) => {
    try {
      const isWindows = process.platform === 'win32';
      
      if (isWindows) {
        // Windows: use taskkill command
        const { exec } = require('child_process');
        return new Promise((resolve, reject) => {
          exec(`taskkill /PID ${pid} /F /T`, (error: any, stdout: string, stderr: string) => {
            if (error) {
              // Process might not exist, which is okay
              if (error.code === 128 || error.message.includes('not found')) {
                resolve({ success: true, message: 'Process not found or already terminated' });
              } else {
                reject({ success: false, error: error.message });
              }
            } else {
              resolve({ success: true, message: 'Process terminated' });
            }
          });
        });
      } else {
        // Unix-like: use kill command
        const { exec } = require('child_process');
        return new Promise((resolve, reject) => {
          exec(`kill -9 ${pid}`, (error: any, stdout: string, stderr: string) => {
            if (error) {
              // Process might not exist, which is okay
              if (error.code === 1 || error.message.includes('No such process')) {
                resolve({ success: true, message: 'Process not found or already terminated' });
              } else {
                reject({ success: false, error: error.message });
              }
            } else {
              resolve({ success: true, message: 'Process terminated' });
            }
          });
        });
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
};

