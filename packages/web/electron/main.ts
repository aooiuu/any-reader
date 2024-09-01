import { app, BrowserWindow, Menu, session } from 'electron';
import { createAPI } from './api';
import { useAutoUpdater } from './updater';
import { useDevTools } from './useDevTools';
import { hookRequest } from './hookRequest';

app.commandLine.appendSwitch('enable-features', 'PlatformHEVCDecoderSupport');
app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('disable-web-security');

app.whenReady().then(async () => {
  hookRequest(session.defaultSession);

  const win = new BrowserWindow({
    title: 'AnyReader',
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  createAPI();
  useDevTools(win);

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

  useAutoUpdater();
});
