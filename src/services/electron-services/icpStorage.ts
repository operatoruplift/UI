import fs from 'fs';
import path from 'path';
import { app } from 'electron';

const authFile = path.join(app.getPath('userData'), 'auth.json');

function readAuthStore() {
  try {
    return JSON.parse(fs.readFileSync(authFile, 'utf-8'));
  } catch {
    return {};
  }
}

function writeAuthStore(store: any) {
  try {
    fs.writeFileSync(authFile, JSON.stringify(store, null, 2));
  } catch (e) {
    console.error('Failed to write auth store', e);
  }
}

export const registerAuthStorage = (ipcMain: any) => {
  ipcMain.handle('auth-storage-get', async (_: any, key: string) => {
    const store = readAuthStore();
    return store[key] ?? null;
  });

  ipcMain.handle('auth-storage-set', async (_: any, key: string, value: string) => {
    const store = readAuthStore();
    store[key] = value;
    writeAuthStore(store);
    return true;
  });

  ipcMain.handle('auth-storage-remove', async (_: any, key: string) => {
    const store = readAuthStore();
    delete store[key];
    writeAuthStore(store);
    return true;
  });
};
