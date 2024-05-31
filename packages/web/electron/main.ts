import { app, BrowserWindow, Menu } from 'electron';
import { createAPI } from './api';

app.whenReady().then(async () => {
  const { api } = require('@any-reader/shared');
  const win = new BrowserWindow({
    title: 'AnyReader',
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  api.init();
  createAPI(win);

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
