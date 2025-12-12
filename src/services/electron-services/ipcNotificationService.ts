/**
 * IPC handlers for notifications
 */

/**
 * Register IPC handlers for notifications
 */
export const registerNotificationHandlers = (ipcMain: any) => {
  // Show notification
  ipcMain.handle("show-notification", async (_event: any, title: string, body: string, options?: any) => {
    try {
      const { Notification } = require("electron");
      
      // Check if notifications are supported
      if (!Notification.isSupported()) {
        console.warn("Notifications are not supported on this system");
        return { success: false, error: "Notifications are not supported on this system" };
      }

      console.log("Showing notification:", { title, body });

      const notification = new Notification({
        title,
        body,
        icon: undefined, // Will use app icon
        silent: false,
        ...options,
      });

      // Handle notification events for debugging
      notification.on('show', () => {
        console.log("Notification shown successfully");
      });

      notification.on('click', () => {
        console.log("Notification clicked");
      });

      notification.on('close', () => {
        console.log("Notification closed");
      });

      notification.on('error', (error: any) => {
        console.error("Notification error:", error);
      });

      notification.show();

      return { success: true };
    } catch (error: any) {
      console.error("Error creating notification:", error);
      return { success: false, error: error.message };
    }
  });
};

