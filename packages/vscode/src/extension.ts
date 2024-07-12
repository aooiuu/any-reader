import * as fs from 'fs';
import * as path from 'path';
import { ExtensionContext, window } from 'vscode';
import getShellExitCommand from './utils/getShellExitCmd';

export async function activate(context: ExtensionContext) {
  // install sqlite3
  await npmInstall(context.extensionPath);
  const { app } = await import('./App');
  app.activate(context);
}

async function npmInstall(cwd: string) {
  return new Promise<void>(async (resolve, reject) => {
    console.log(`extensionPath: ${cwd}`);
    window.showInformationMessage(`正在安装 sqlite3, 如果失败, 可以手动安装: cd ${cwd} && npm install`);

    if (fs.existsSync(path.resolve(cwd, 'node_modules'))) {
      return resolve();
    }
    const terminal = window.createTerminal({ name: 'AnyReader', cwd });
    window.onDidCloseTerminal((e: any) => {
      if (e.processId !== terminal.processId) {
        return;
      }
      try {
        terminal.dispose();
      } catch (err) {}
      if (e.exitStatus.code === 0) {
        return resolve();
      }
      reject('failed to install');
    });
    const exitCmdPromise = getShellExitCommand();
    terminal.show();
    terminal.sendText(`npm install ${await exitCmdPromise}`);
  });
}

export function deactivate() {}
