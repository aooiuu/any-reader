import { register, unregisterAll } from 'electron-localshortcut';
import { BrowserWindow } from 'electron/main';

export function useDevTools(win: BrowserWindow) {
  win.on('close', () => {
    console.log('close');
    unregisterAll(win!);
  });

  win.on('ready-to-show', () => {
    register(win!, ['F12', 'CommandOrControl+Shift+I'], () => {
      if (win!.webContents.isDevToolsOpened()) {
        win!.webContents.closeDevTools();
      } else {
        win!.webContents.openDevTools();
      }
    });
  });
}
