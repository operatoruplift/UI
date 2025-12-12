const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { app } = require('electron');

export const loadEnv = () => {
  // Detect path depending on dev vs production
  const envPath = app.isPackaged
    ? path.join((process as any).resourcesPath, '.env') // when built
    : path.join(process.cwd(), '.env');        // during dev

  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log('✅ Loaded .env from', envPath);
  } else {
    console.warn('⚠️ No .env file found at', envPath);
  }
}


export const exposeEnv = (ipcMain: any) => {
  ipcMain.handle('get-env', (_: any, key: string) => process.env[key]);
}