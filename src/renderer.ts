class ChatApp {
  constructor() {
    this.init();
  }

  private async init() {
    await this.loadAppInfo();
  }

  private async loadAppInfo() {
    try {
      if (!window.electronAPI) {
        console.warn("ElectronAPI not available");
        return;
      }
      const info = await window.electronAPI.getAppInfo();
      const statusEl = document.getElementById("app-status");
      if (statusEl) {
        statusEl.textContent = `${info.appName} ${info.version}`;
      }
    } catch (error) {
      console.error("Failed to load app info:", error);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new ChatApp();
});
