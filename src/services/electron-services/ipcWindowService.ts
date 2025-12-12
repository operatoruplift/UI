/**
 * IPC handlers for window control operations
 */

const {
  minimizeWindow,
  maximizeWindow,
  hideWindow,
  toggleWindow,
} = require("./windowService");

/**
 * Register IPC handlers for window operations
 */
export const registerWindowHandlers = (ipcMain: any) => {
  // Window control handlers
  ipcMain.on("minimize-window", () => {
    minimizeWindow();
  });

  ipcMain.on("maximize-window", () => {
    maximizeWindow();
  });

  ipcMain.on("close-window", () => {
    // Hide to tray instead of closing
    hideWindow();
  });

  ipcMain.on("toggle-window", () => {
    toggleWindow();
  });

  ipcMain.on("hide-to-tray", () => {
    hideWindow();
  });
};

