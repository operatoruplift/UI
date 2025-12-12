/**
 * IPC handlers for app information, device info, and environment variables
 */

const { app } = require("electron");

/**
 * Register IPC handlers for app info, device info, and env
 */
export const registerAppHandlers = (ipcMain: any) => {
  // App info handler
  ipcMain.handle("get-app-info", async () => {
    return {
      appName: "Uplift OS",
      version: "0.0.1-beta",
      status: "Beta",
    };
  });

  // Get device information
  ipcMain.handle("get-device-info", async () => {
    return {
      platform: process.platform, // 'win32', 'darwin', 'linux'
      appVersion: app.getVersion(),
      osVersion: require('os').release(),
      arch: process.arch,
    };
  });
};

