import { registerAuthStorage } from "./services/electron-services/icpStorage";

const { app, BrowserWindow, ipcMain, nativeImage } = require("electron");
const path = require("path");
const fs = require("fs");
require('./services/electron-services/ipcLoadEnvService').loadEnv();

// Set dock icon for macOS
if (process.platform === 'darwin' && app.dock) {
  const iconPaths = [
    path.join(__dirname, "..", "assets", "images", "logo", "logo.png"),
    path.join(__dirname, "assets", "images", "logo", "logo.png"),
    path.join(__dirname, "..", "assets", "images", "logo", "logo.ico"),
    path.join(__dirname, "assets", "images", "logo", "logo.ico"),
  ];
  
  for (const iconPath of iconPaths) {
    if (fs.existsSync(iconPath)) {
      try {
        const icon = nativeImage.createFromPath(iconPath);
        if (!icon.isEmpty()) {
          app.dock.setIcon(icon);
        }
      } catch (e) {
        console.warn('Failed to set dock icon:', e);
      }
      break;
    }
  }
}
// Import services
const {
  createTray,
} = require("./services/electron-services/trayService");
const {
  createWindow,
  getWindow,
  toggleWindow,
  hideWindow,
  setIsQuitting,
} = require("./services/electron-services/windowService");
const {
  showStartupNotification,
} = require("./services/electron-services/notificationService");
const {
  configureAutoLaunch,
} = require("./services/electron-services/startupService");
const {
  registerShortcuts,
} = require("./services/electron-services/shortcutService");
const {
  startInstalledAgentExecutables,
  startAgentOnInstall,
} = require("./services/electron-services/agentStartupService");

// Import IPC handlers
const { registerAppHandlers } = require("./services/electron-services/ipcAppService");
const { registerFileHandlers } = require("./services/electron-services/ipcFileService");
const { registerProcessHandlers } = require("./services/electron-services/ipcProcessService");
const { registerShellHandlers } = require("./services/electron-services/ipcShellService");
const { registerWindowHandlers } = require("./services/electron-services/ipcWindowService");
const { registerNotificationHandlers } = require("./services/electron-services/ipcNotificationService");
const { registerShortcutHandlers } = require("./services/electron-services/ipcShortcutService");
const { exposeEnv } = require("./services/electron-services/ipcLoadEnvService");
// Configure auto-launch on startup
configureAutoLaunch();

app.whenReady().then(() => {
  // Create paths
  const preloadPath = path.join(__dirname, "preload.js");
  const htmlPath = path.join(__dirname, "..", "index.html");

  // Initialize services
  createWindow(preloadPath, htmlPath);
  createTray(() => toggleWindow(), () => {
    setIsQuitting(true);
    app.quit();
  });

  // Start hidden in system tray
  hideWindow();

  // Register global shortcuts (toggle window and voice activation)
  // Small delay to ensure app is fully ready before registering shortcuts
  const handleVoiceActivation = () => {
    // Navigate to voice chat page when voice activation is triggered
    const mainWindow = getWindow();
    if (mainWindow) {
      mainWindow.webContents.send('navigate-to-voice-chat');
    }
  };
  
  // Delay shortcut registration slightly to ensure app is fully initialized
  setTimeout(() => {
    registerShortcuts(() => toggleWindow(), handleVoiceActivation);
  }, 500);

  // Start installed agent executables as background processes
  // Delay to ensure app is fully ready
  setTimeout(() => {
    startInstalledAgentExecutables();
  }, 1000);

  // Show startup notification
  // Delay slightly to ensure app is fully ready
  setTimeout(() => {
    showStartupNotification(() => {
      // Show window when notification is clicked
      toggleWindow();
    });
  }, 1500);

  app.on("activate", () => {
    const mainWindow = getWindow();
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(preloadPath, htmlPath);
      // Keep hidden on activate too
      hideWindow();
    }
  });

  // Watch for file changes in development
  if (process.env.NODE_ENV !== 'production') {
    const watchPaths = [
      path.join(__dirname, 'renderer.js'),
      path.join(__dirname, 'output.css')
    ];

    watchPaths.forEach(filePath => {
      try {
        fs.watch(filePath, (eventType: any) => {
          if (eventType === 'change') {
            const mainWindow = getWindow();
            if (mainWindow) {
              console.log(`File changed: ${filePath}, reloading...`);
              mainWindow.webContents.reload();
            }
          }
        });
      } catch (error) {
        console.log(`Could not watch ${filePath}`);
      }
    });
  }
});

app.on("window-all-closed", () => {
  // Don't quit on Windows - keep running in tray
  if (process.platform === "darwin") {
    app.quit();
  }
});

// Register all IPC handlers
exposeEnv(ipcMain);
registerAppHandlers(ipcMain);
registerFileHandlers(ipcMain);
registerProcessHandlers(ipcMain);
registerShellHandlers(ipcMain);
registerWindowHandlers(ipcMain);
registerNotificationHandlers(ipcMain);
registerShortcutHandlers(ipcMain);
registerAuthStorage(ipcMain);

// Register agent startup handlers
ipcMain.handle('start-agent-on-install', (_event: any, agentId: string) => {
  try {
    startAgentOnInstall(agentId);
    return { success: true };
  } catch (error: any) {
    console.error('Error starting agent on install:', error);
    return { success: false, error: error.message };
  }
});