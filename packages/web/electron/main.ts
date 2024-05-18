import { app, BrowserWindow, Menu } from 'electron';

app.whenReady().then(() => {
  const win = new BrowserWindow({
    title: 'AnyReader',
    titleBarStyle: 'hidden'
  });

  // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);

    // 打开调试工具
    win.webContents.openDevTools();
  } else {
    // Load your file
    win.loadFile('dist/index.html');
  }
  Menu.setApplicationMenu(null);
});
