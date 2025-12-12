/**
 * IPC handlers for file operations (download, read, delete, etc.)
 */

const path = require("path");
const fs = require("fs");
const https = require("https");
const http = require("http");

/**
 * Register IPC handlers for file operations
 */
export const registerFileHandlers = (ipcMain: any) => {
  // Download file handler with progress tracking
  ipcMain.handle("download-file", async (event: any, url: string, filePath: string) => {
    return new Promise((resolve, reject) => {
      try {
        // Normalize path (handle both forward and backslashes)
        const normalizedPath = path.normalize(filePath);
        
        // Ensure directory exists
        const dir = path.dirname(normalizedPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // Determine protocol
        const protocol = url.startsWith('https') ? https : http;

        const file = fs.createWriteStream(normalizedPath);
        let downloadedBytes = 0;
        let totalBytes = 0;
        
        // Handle file stream errors
        file.on('error', (err: any) => {
          file.close();
          if (fs.existsSync(normalizedPath)) {
            fs.unlinkSync(normalizedPath);
          }
          reject(err);
        });
        
        const sendProgress = (downloaded: number, total: number) => {
          event.sender.send('download-progress', {
            filePath: normalizedPath,
            originalFilePath: filePath,
            downloaded,
            total,
            percentage: total > 0 ? Math.round((downloaded / total) * 100) : 0
          });
        };
        
        protocol.get(url, (response: any) => {
          // Check for error status codes
          if (response.statusCode >= 400) {
            file.close();
            if (fs.existsSync(normalizedPath)) {
              fs.unlinkSync(normalizedPath);
            }
            reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
            return;
          }
          
          if (response.statusCode === 301 || response.statusCode === 302) {
            // Handle redirect
            file.close();
            const redirectFile = fs.createWriteStream(normalizedPath);
            
            redirectFile.on('error', (err: any) => {
              redirectFile.close();
              if (fs.existsSync(normalizedPath)) {
                fs.unlinkSync(normalizedPath);
              }
              reject(err);
            });
            
            return protocol.get(response.headers.location, (redirectResponse: any) => {
              totalBytes = parseInt(redirectResponse.headers['content-length'] || '0', 10);
              
              redirectResponse.on('data', (chunk: any) => {
                downloadedBytes += chunk.length;
                sendProgress(downloadedBytes, totalBytes);
              });
              
              redirectResponse.pipe(redirectFile);
              redirectFile.on('finish', () => {
                redirectFile.close();
                resolve({ success: true, path: normalizedPath });
              });
            }).on('error', (err: any) => {
              redirectFile.close();
              if (fs.existsSync(normalizedPath)) {
                fs.unlinkSync(normalizedPath);
              }
              reject(err);
            });
          }

          totalBytes = parseInt(response.headers['content-length'] || '0', 10);
          
          response.on('data', (chunk: any) => {
            downloadedBytes += chunk.length;
            sendProgress(downloadedBytes, totalBytes);
          });
          
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve({ success: true, path: normalizedPath });
          });
        }).on('error', (err: any) => {
          file.close();
          if (fs.existsSync(normalizedPath)) {
            fs.unlinkSync(normalizedPath);
          }
          reject(err);
        });
      } catch (error) {
        reject(error);
      }
    });
  });

  // Download JSON data handler
  ipcMain.handle("download-json", async (_event: any, url: string, filePath: string) => {
    return new Promise((resolve, reject) => {
      try {
        // Normalize path (handle both forward and backslashes)
        const normalizedPath = path.normalize(filePath);
        // Ensure directory exists
        const dir = path.dirname(normalizedPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // Determine protocol
        const protocol = url.startsWith('https') ? https : http;

        const chunks: Buffer[] = [];

        protocol.get(url, (response: any) => {
          // Check for error status codes
          if (response.statusCode >= 400) {
            reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
            return;
          }

          // Don't set encoding - handle as buffers for binary-safe operation
          if (response.statusCode === 301 || response.statusCode === 302) {
            // Handle redirect
            return protocol.get(response.headers.location, (redirectResponse: any) => {
              // Check for error status codes in redirect
              if (redirectResponse.statusCode >= 400) {
                reject(new Error(`HTTP ${redirectResponse.statusCode}: ${redirectResponse.statusMessage}`));
                return;
              }

              const redirectChunks: Buffer[] = [];

              redirectResponse.on('data', (chunk: Buffer) => {
                redirectChunks.push(chunk);
              });
              redirectResponse.on('end', () => {
                try {
                  const data = Buffer.concat(redirectChunks).toString('utf8');
                  fs.writeFileSync(normalizedPath, data, 'utf8');
                  resolve({ success: true, path: normalizedPath });
                } catch (err) {
                  reject(err);
                }
              });
            }).on('error', (err: any) => {
              reject(err);
            });
          }

          response.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
          });

          response.on('end', () => {
            try {
              const data = Buffer.concat(chunks).toString('utf8');
              fs.writeFileSync(normalizedPath, data, 'utf8');
              resolve({ success: true, path: normalizedPath });
            } catch (err) {
              reject(err);
            }
          });
        }).on('error', (err: any) => {
          reject(err);
        });
      } catch (error) {
        reject(error);
      }
    });
  });

  // Get user data directory
  ipcMain.handle("get-user-data-path", async () => {
    const { app } = require("electron");
    return app.getPath('userData');
  });

  // Check if file exists and get its size
  ipcMain.handle("get-file-size", async (_event: any, filePath: string) => {
    try {
      const normalizedPath = path.normalize(filePath);
      if (fs.existsSync(normalizedPath)) {
        const stats = fs.statSync(normalizedPath);
        return { exists: true, size: stats.size };
      }
      return { exists: false, size: 0 };
    } catch (error: any) {
      console.error('Error getting file size:', error);
      return { exists: false, size: 0 };
    }
  });

  // Delete directory and all its contents
  ipcMain.handle("delete-directory", async (_event: any, dirPath: string) => {
    try {
      const normalizedPath = path.normalize(dirPath);
      
      if (!fs.existsSync(normalizedPath)) {
        return { success: true, message: 'Directory does not exist' };
      }

      // Recursively delete directory
      const deleteRecursive = (dir: string) => {
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir);
          files.forEach((file: string) => {
            const curPath = path.join(dir, file);
            if (fs.lstatSync(curPath).isDirectory()) {
              deleteRecursive(curPath);
            } else {
              fs.unlinkSync(curPath);
            }
          });
          fs.rmdirSync(dir);
        }
      };

      deleteRecursive(normalizedPath);
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting directory:', error);
      throw error;
    }
  });

  // Read file content
  ipcMain.handle("read-file", async (_event: any, filePath: string) => {
    try {
      const normalizedPath = path.normalize(filePath);
      if (!fs.existsSync(normalizedPath)) {
        return { success: false, error: 'File does not exist' };
      }
      const content = fs.readFileSync(normalizedPath, 'utf8');
      return { success: true, content };
    } catch (error: any) {
      console.error('Error reading file:', error);
      return { success: false, error: error.message };
    }
  });

  // List directory and find executable file
  ipcMain.handle("find-executable", async (_event: any, dirPath: string) => {
    try {
      const normalizedPath = path.normalize(dirPath);
      if (!fs.existsSync(normalizedPath)) {
        return { success: false, error: 'Directory does not exist' };
      }

      const files = fs.readdirSync(normalizedPath);
      // Look for .exe, .app, or other executable extensions
      const executableExtensions = ['.exe', '.app', '.bin', '.run', '.sh'];
      const executableFile = files.find((file: string) => {
        const ext = path.extname(file).toLowerCase();
        return executableExtensions.includes(ext);
      });

      if (executableFile) {
        const fullPath = path.join(normalizedPath, executableFile);
        return { success: true, path: fullPath, filename: executableFile };
      }

      return { success: false, error: 'No executable file found' };
    } catch (error: any) {
      console.error('Error finding executable:', error);
      return { success: false, error: error.message };
    }
  });

  // Write file content
  ipcMain.handle("write-file", async (_event: any, filePath: string, content: string) => {
    try {
      const normalizedPath = path.normalize(filePath);
      
      // Ensure directory exists
      const dir = path.dirname(normalizedPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(normalizedPath, content, 'utf8');
      return { success: true };
    } catch (error: any) {
      console.error('Error writing file:', error);
      return { success: false, error: error.message };
    }
  });
};

