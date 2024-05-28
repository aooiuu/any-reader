import * as os from 'node:os';
import * as path from 'node:path';
import { BrowserWindow, app } from 'electron';
import EasyPostMessage from 'easy-post-message';
import Adapter from 'easy-post-message/electron-adapter';
import { getConfig } from './config';

export const ROOT_PATH = path.join(os.homedir(), '.any-reader');
export const CONFIG_PATH = path.join(ROOT_PATH, 'config.desktop.json');

function success(data: any, msg = '') {
  return {
    code: 0,
    data,
    msg
  };
}

export function createAPI(win: BrowserWindow) {
  const pm = new EasyPostMessage(Adapter);
  const { api } = require('@any-reader/shared');

  api.useApi(pm.answer.bind(pm), {
    CONFIG_PATH,
    bookDir: getConfig().bookDir
  });

  pm.answer('get@minimize', () => {
    win.minimize();
    return success(true);
  });
  pm.answer('get@maximize', () => {
    console.log('[maximize]');
    win.isMaximized() ? win.unmaximize() : win.maximize();
    return success(true);
  });
  pm.answer('get@exit', () => {
    app.quit();
    process.exit(0);
  });

  pm.answer('post@alwaysOnTop', ({ pinned = true }) => {
    pinned ? win.setAlwaysOnTop(true, 'screen-saver') : win.setAlwaysOnTop(false);
    return success(win.isAlwaysOnTop());
  });

  pm.answer('post@openWindow', (data) => {
    const window = new BrowserWindow({
      title: 'AnyReader',
      // titleBarStyle: 'hidden',
      webPreferences: { nodeIntegration: true, contextIsolation: false }
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
