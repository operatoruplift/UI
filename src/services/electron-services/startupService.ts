const { app } = require("electron");

export const configureAutoLaunch = () => {
  // Configure auto-launch on startup - always start hidden
  app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: true, // Start hidden in system tray
  });
};

