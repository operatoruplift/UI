/**
 * IPC handlers for shell/path operations
 */

const path = require("path");

/**
 * Register IPC handlers for shell operations
 */
export const registerShellHandlers = (ipcMain: any) => {
  // Open file or URL
  ipcMain.handle("open-path", async (_event: any, filePath: string) => {
    try {
      const { shell } = require("electron");
      
      // Check if it's a URL
      if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
        await shell.openExternal(filePath);
      } else {
        // Normalize path for cross-platform compatibility
        const normalizedPath = path.normalize(filePath);
        await shell.openPath(normalizedPath);
      }
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  // Show folder picker dialog
  ipcMain.handle("show-folder-picker", async (_event: any) => {
    try {
      const { dialog, BrowserWindow } = require("electron");
      const mainWindow = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
      
      if (!mainWindow) {
        return { success: false, error: 'No window available' };
      }

      const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
        title: 'Select Storage Folder'
      });

      if (result.canceled || result.filePaths.length === 0) {
        return { success: false, canceled: true };
      }

      return { success: true, path: result.filePaths[0] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
};

