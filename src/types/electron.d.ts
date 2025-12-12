// Type definitions for window.electronAPI

export interface ElectronAPI {
  // App info
  sendMessage?: (message: string) => Promise<any>;
  getAppInfo: () => Promise<{
    appName: string;
    version: string;
    status: string;
  }>;
  getDeviceInfo: () => Promise<{
    platform: string;
    appVersion: string;
    osVersion: string;
    arch: string;
  }>;
  onAppInfoUpdate: (callback: (data: any) => void) => void;

  // Window controls
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  toggleWindow: () => void;
  hideToTray: () => void;

  // Env + file operations
  getEnv: (key: string) => Promise<string>; // ✅ should be Promise<string>, not string
  downloadFile: (url: string, filePath: string) => Promise<{ success: boolean; path: string }>;
  downloadJson: (url: string, filePath: string) => Promise<{ success: boolean; path: string }>;
  getUserDataPath: () => Promise<string>;
  getFileSize: (filePath: string) => Promise<{ exists: boolean; size: number }>;
  onDownloadProgress: (
    callback: (progress: { filePath: string; downloaded: number; total: number; percentage: number }) => void
  ) => () => void;
  deleteDirectory: (dirPath: string) => Promise<{ success: boolean; message?: string }>;
  readFile: (filePath: string) => Promise<{ success: boolean; content?: string; error?: string }>;
  findExecutable: (dirPath: string) => Promise<{ success: boolean; path?: string; filename?: string; error?: string }>;
  executeCommand: (
    command: string,
    options?: { cwd?: string; detached?: boolean }
  ) => Promise<{ success: boolean; pid?: number; stdout?: string; stderr?: string; code?: number; error?: string }>;
  killProcess: (pid: number) => Promise<{ success: boolean; message?: string; error?: string }>;
  showNotification: (title: string, body: string, options?: any) => Promise<{ success: boolean; error?: string }>;
  openPath: (filePath: string) => Promise<{ success: boolean; error?: string }>;
  showFolderPicker: () => Promise<{ success: boolean; path?: string; canceled?: boolean; error?: string }>;

  // Auth storage
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;

  // Shortcut operations
  getShortcuts: () => Promise<Array<{
    id: string;
    label: string;
    description: string;
    defaultShortcut: string;
    currentShortcut: string;
  }>>;
  updateShortcut: (id: string, newShortcut: string) => Promise<{ success: boolean; error?: string }>;
  resetShortcut: (id: string) => Promise<{ success: boolean; error?: string }>;
  onNavigateToVoiceChat: (callback: () => void) => () => void;

  ready?: Promise<boolean>; // optional since it's not always exposed
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
