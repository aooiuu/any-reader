/**
 * webview 消息处理
 */

import * as path from 'node:path';
import * as vscode from 'vscode';
import EasyPostMessage from 'easy-post-message';
import { createApp } from '@any-reader/shared';
import { createAdapter } from '../utils/easyPostMessage';
import { CONFIG_PATH } from '../constants';

export class WebviewEvent {
  private _pm!: EasyPostMessage;

  get pm() {
    return this._pm;
  }

  constructor(webview: vscode.Webview, extensionPath: string) {
    this._pm = new EasyPostMessage(createAdapter(webview));
    this._pm.answer('post@vscode/executeCommand', this.executeCommand.bind(this));

    const app = createApp({
      configPath: CONFIG_PATH,
      dataSourceOptions: {
        driver: require('sql.js/dist/sql-wasm'),
        sqlJsConfig: {
          locateFile: (file: string) => {
            console.log('[locateFile]', path.join(extensionPath, 'dist', file));
            return path.join(extensionPath, 'dist', file);
          }
        }
      }
    });

    app.useApi(this._pm.answer.bind(this._pm));
  }

  private executeCommand({ command, data }: any) {
    const args = Array.isArray(data) ? data : typeof data === 'object' ? [data] : [];
    vscode.commands.executeCommand(command, ...args);
  }
}

export function useWebviewEvent(webView: vscode.Webview, extensionPath: string) {
  return new WebviewEvent(webView, extensionPath);
}
