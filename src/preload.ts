const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getAppInfo: () => ipcRenderer.invoke("get-app-info"),
  getDeviceInfo: () => ipcRenderer.invoke("get-device-info"),
  getEnv: (key: string) => ipcRenderer.invoke("get-env", key),
  onAppInfoUpdate: (callback: (data: any) => void) =>
    ipcRenderer.on("app-info-update", (_event: any, data: any) => callback(data)),
  // Window controls
  minimizeWindow: () => ipcRenderer.send("minimize-window"),
  maximizeWindow: () => ipcRenderer.send("maximize-window"),
  closeWindow: () => ipcRenderer.send("close-window"),
  toggleWindow: () => ipcRenderer.send("toggle-window"),
  hideToTray: () => ipcRenderer.send("hide-to-tray"),
  // File operations
  downloadFile: (url: string, filePath: string) => ipcRenderer.invoke("download-file", url, filePath),
  downloadJson: (url: string, filePath: string) => ipcRenderer.invoke("download-json", url, filePath),
  getUserDataPath: () => ipcRenderer.invoke("get-user-data-path"),
  getFileSize: (filePath: string) => ipcRenderer.invoke("get-file-size", filePath),
  onDownloadProgress: (callback: (progress: { filePath: string; downloaded: number; total: number; percentage: number }) => void) => {
    ipcRenderer.on("download-progress", (_event: any, progress: any) => callback(progress));
    return () => ipcRenderer.removeAllListeners("download-progress");
  },
  deleteDirectory: (dirPath: string) => ipcRenderer.invoke("delete-directory", dirPath),
  readFile: (filePath: string) => ipcRenderer.invoke("read-file", filePath),
  writeFile: (filePath: string, content: string) => ipcRenderer.invoke("write-file", filePath, content),
  findExecutable: (dirPath: string) => ipcRenderer.invoke("find-executable", dirPath),
  executeCommand: (command: string, options?: { cwd?: string; detached?: boolean; commandId?: string; signal?: AbortSignal }) => ipcRenderer.invoke("execute-command", command, options),
  killProcess: (pid: number) => ipcRenderer.invoke("kill-process", pid),
  onCommandOutput: (callback: (commandId: string, line: string) => void) => {
    ipcRenderer.on("command-output", (_event: any, commandId: string, line: string) => callback(commandId, line));
    return () => ipcRenderer.removeAllListeners("command-output");
  },
  onCommandComplete: (callback: (commandId: string, result: any) => void) => {
    ipcRenderer.on("command-complete", (_event: any, commandId: string, result: any) => callback(commandId, result));
    return () => ipcRenderer.removeAllListeners("command-complete");
  },
  showNotification: (title: string, body: string, options?: any) => ipcRenderer.invoke("show-notification", title, body, options),
  openPath: (filePath: string) => ipcRenderer.invoke("open-path", filePath),
  showFolderPicker: () => ipcRenderer.invoke("show-folder-picker"),


  getItem: (key: string) => ipcRenderer.invoke('auth-storage-get', key),
  setItem: (key: string, value: string) => ipcRenderer.invoke('auth-storage-set', key, value),
  removeItem: (key: string) => ipcRenderer.invoke('auth-storage-remove', key),

  // Shortcut operations
  getShortcuts: () => ipcRenderer.invoke('get-shortcuts'),
  updateShortcut: (id: string, newShortcut: string) => ipcRenderer.invoke('update-shortcut', id, newShortcut),
  resetShortcut: (id: string) => ipcRenderer.invoke('reset-shortcut', id),
  onNavigateToVoiceChat: (callback: () => void) => {
    ipcRenderer.on('navigate-to-voice-chat', () => callback());
    return () => ipcRenderer.removeAllListeners('navigate-to-voice-chat');
  },

  // Agent operations
  startAgentOnInstall: (agentId: string) => ipcRenderer.invoke('start-agent-on-install', agentId),

  ready: Promise.resolve(true),
});
