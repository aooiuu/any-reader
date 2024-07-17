import * as os from 'node:os';
import * as path from 'node:path';
import { BrowserWindow, app } from 'electron';
import EasyPostMessage from 'easy-post-message';
import Adapter from 'easy-post-message/electron-adapter';
import { createApp } from '@any-reader/shared';

export const ROOT_PATH = path.join(os.homedir(), '.any-reader');
export const CONFIG_PATH = path.join(ROOT_PATH, 'config.desktop.json');

function success(data: any, msg = '') {
  return {
    code: 0,
    data,
    msg
  };
}

export function createAPI() {
  const pm = new EasyPostMessage(Adapter);

  createApp({
    configPath: CONFIG_PATH
  }).useApi(pm.answer.bind(pm));

  pm.answer('get@minimize', () => {
    BrowserWindow.getFocusedWindow()?.minimize();
    return success(true);
  });

  pm.answer('get@maximize', () => {
    const w = BrowserWindow.getFocusedWindow();
    w?.isMaximized() ? w?.unmaximize() : w?.maximize();
    return success(true);
  });

  pm.answer('get@exit', () => {
    const w = BrowserWindow.getFocusedWindow();
    w?.close();

    if (BrowserWindow.getAllWindows().length === 0) {
      app.quit();
      process.exit(0);
    }
  });

  pm.answer('post@alwaysOnTop', ({ pinned = true }) => {
    const w = BrowserWindow.getFocusedWindow();
    pinned ? w?.setAlwaysOnTop(true, 'screen-saver') : w?.setAlwaysOnTop(false);
    return success(w?.isAlwaysOnTop());
  });

  pm.answer('post@openWindow', (data) => {
    const window = new BrowserWindow({
      title: 'AnyReader',
      titleBarStyle: 'hidden',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false
      }
    });

    if (process.env.VITE_DEV_SERVER_URL) {
      window.loadURL(process.env.VITE_DEV_SERVER_URL + '/#' + data.url);
    } else {
      window.loadFile('dist/electron-template/index.html', {
        hash: data.url
      });
    }
  });
}
