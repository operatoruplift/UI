const { Tray, Menu, app } = require("electron");
const path = require("path");
const fs = require("fs");

let tray: any = null;

export const createTray = (toggleWindow: () => void, quitApp: () => void) => {
  if (tray) {
    return tray; // Tray already created
  }
  
  // Create system tray icon - try multiple paths
  let trayIcon: string | null = null;
  
  const iconPaths = [
    path.join(__dirname, "..", "..", "assets", "images", "logo", "logo.ico"),
    path.join(__dirname, "assets", "images", "logo", "logo.ico"),
    path.join(app.getAppPath(), "assets", "images", "logo", "logo.ico"),
  ];
  
  for (const iconPath of iconPaths) {
    if (fs.existsSync(iconPath)) {
      trayIcon = iconPath;
      break;
    }
  }
  
  // If no icon found, use a default (Electron will handle this gracefully)
  if (!trayIcon) {
    trayIcon = app.getAppPath() + "/assets/images/logo/logo.ico";
  }
  
  try {
    tray = new Tray(trayIcon);
  } catch (error) {
    console.warn("Failed to create tray icon:", error);
    try {
      tray = new Tray(trayIcon || "");
    } catch (e) {
      console.error("Could not create system tray");
      return null;
    }
  }
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Window',
      click: () => {
        toggleWindow();
      }
    },
    {
      label: 'Hide to Tray',
      click: () => {
        toggleWindow();
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        quitApp();
      }
    }
  ]);
  
  tray.setToolTip('Uplift OS');
  tray.setContextMenu(contextMenu);
  
  // Double click to show/hide window
  tray.on('double-click', () => {
    toggleWindow();
  });

  return tray;
};

export const getTray = () => tray;

