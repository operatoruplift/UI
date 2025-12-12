/**
 * Show a notification using Electron's IPC
 * This works in the renderer process by calling the main process via IPC
 */
export const showNotification = async (title: string, body: string, options?: any): Promise<void> => {
  try {
    if (typeof window !== 'undefined' && (window as any).electronAPI?.showNotification) {
      const result = await (window as any).electronAPI.showNotification(title, body, options);
      if (result && !result.success) {
        // Fallback to browser notifications if Electron notification fails
        fallbackToBrowserNotification(title, body, options);
      }
    } else {
      // Fallback to browser Notification API if Electron API is not available
      fallbackToBrowserNotification(title, body, options);
    }
  } catch (error) {
    // Try browser fallback on error
    try {
      fallbackToBrowserNotification(title, body, options);
    } catch (fallbackError) {
      // Silent fail
    }
  }
};

/**
 * Fallback to browser Notification API
 */
const fallbackToBrowserNotification = (title: string, body: string, options?: any): void => {
  if (typeof window === 'undefined') return;
  
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, ...options });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(title, { body, ...options });
        }
      });
    }
  }
};

/**
 * Show startup notification (for main process use)
 * This should be called from the main process, not the renderer
 * Note: This uses a dynamic require to avoid bundling issues in the renderer
 */
export const showStartupNotification = (onClick: () => void) => {
  // This function should only be used in the main process
  // For renderer, use showNotification instead
  if (typeof window === 'undefined') {
    // Use dynamic require to prevent esbuild from trying to bundle electron
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const electron = require("electron");
    const { Notification } = electron;
    
    if (!Notification.isSupported()) {
      return null;
    }

    const notification = new Notification({
      title: "Uplift AI",
      body: "Uplift AI is running in the background. Click to open or press Ctrl+Alt+K.",
      icon: undefined,
      silent: false,
      timeoutType: "default",
    });

    notification.show();

    // Handle notification click - open the window
    notification.on('click', () => {
      onClick();
    });

    return notification;
  }
  
  return null;
};

