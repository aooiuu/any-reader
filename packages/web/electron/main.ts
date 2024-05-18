import { app, BrowserWindow, Menu } from 'electron';
import { api } from '@any-reader/shared';
import { createAPI } from './api';

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    title: 'AnyReader',
    titleBarStyle: 'hidden',
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });

  api.init();
  createAPI();

  // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);

    // 打开调试工具
    win.webContents.openDevTools();
  } else {
    // Load your file
    win.loadFile('dist/electron-template/index.html');
  }
  Menu.setApplicationMenu(null);
});
