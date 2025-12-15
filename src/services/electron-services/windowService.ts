const { BrowserWindow, screen: electronScreen, app, nativeImage } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow: any = null;
let isQuitting = false;

export const setIsQuitting = (value: boolean) => {
  isQuitting = value;
};

export const getIsQuitting = () => isQuitting;

// Get the app icon path
const getIconPath = () => {
  const iconName = process.platform === 'win32' ? 'logo.ico' : 'logo.png';
  const iconPaths = [
    path.join(__dirname, "..", "..", "assets", "images", "logo", iconName),
    path.join(__dirname, "assets", "images", "logo", iconName),
    path.join(app.getAppPath(), "assets", "images", "logo", iconName),
  ];
  
  for (const iconPath of iconPaths) {
    if (fs.existsSync(iconPath)) {
      return iconPath;
    }
  }
  
  // Fallback to ico if png not found
  const fallbackPaths = [
    path.join(__dirname, "..", "..", "assets", "images", "logo", "logo.ico"),
    path.join(__dirname, "assets", "images", "logo", "logo.ico"),
    path.join(app.getAppPath(), "assets", "images", "logo", "logo.ico"),
  ];
  
  for (const iconPath of fallbackPaths) {
    if (fs.existsSync(iconPath)) {
      return iconPath;
    }
  }
  
  return null;
};

export const createWindow = (preloadPath: string, htmlPath: string) => {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
    return mainWindow;
  }

  // Get the primary display's dimensions
  const primaryDisplay = electronScreen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  
  // Get icon path
  const iconPath = getIconPath();

  mainWindow = new BrowserWindow({
    width: width * 0.75,
    height: height * 0.9,
    minWidth: 600,
    minHeight: 400,
    frame: false,
    show: false, // Don't show until ready
    icon: iconPath || undefined,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(htmlPath);
  
  // Don't auto-show - always start hidden in tray
  // Window will only show when user explicitly requests it (tray menu, shortcut, etc.)
  
  // Handle window close - hide to tray instead of quitting
  mainWindow.on('close', (event: any) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  return mainWindow;
};

export const getWindow = () => mainWindow;

export const toggleWindow = () => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    // Paths will be provided by main.ts when needed
    console.warn('Window not initialized. Call createWindow first.');
    return;
  }
  
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    mainWindow.show();
    mainWindow.focus();
  }
};

export const showWindow = () => {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  }
};

export const hideWindow = () => {
  if (mainWindow) {
    mainWindow.hide();
  }
};

export const minimizeWindow = () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
};

export const maximizeWindow = () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
};

