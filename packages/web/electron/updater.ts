import { dialog } from 'electron';
import { autoUpdater } from 'electron-updater';

export function useAutoUpdater() {
  autoUpdater.checkForUpdates();

  autoUpdater.on('error', (err) => {
    console.error(err);
  });

  autoUpdater.on('update-downloaded', () => {
    dialog
      .showMessageBox({
        type: 'info',
        title: '应用更新',
        message: '发现新版本，是否更新？',
        buttons: ['是', '否']
      })
      .then((buttonIndex) => {
        if (buttonIndex.response == 0) {
          autoUpdater.quitAndInstall();
        }
      });
  });
}
