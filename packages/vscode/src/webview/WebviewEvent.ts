/**
 * webview 消息处理
 */

import * as os from 'node:os';
import * as path from 'node:path';
import * as vscode from 'vscode';
import * as EasyPostMessage from 'easy-post-message';
import { Api } from '@any-reader/shared';
import { createAdapter } from '../utils/easyPostMessage';

export const ROOT_PATH = path.join(os.homedir(), '.any-reader');
export const CONFIG_PATH = path.join(ROOT_PATH, 'config.vscode.json');

export class WebviewEvent {
  private _pm: any;

  get pm() {
    return this._pm;
  }

  constructor(webview: vscode.Webview) {
    // @ts-ignore
    this._pm = new EasyPostMessage(createAdapter(webview));

    // 消息通信, 为了以后兼容 XHR, 模板分离出独立可运行浏览器版本

    // vsc
    this._pm.answer('post@vscode/executeCommand', this.executeCommand.bind(this));

    new Api({
      configPath: CONFIG_PATH
    }).useApi(this._pm.answer.bind(this._pm));
  }

  private executeCommand({ command, data }: any) {
    const args = Array.isArray(data) ? data : typeof data === 'object' ? [data] : [];
    vscode.commands.executeCommand(command, ...args);
  }
}

export function useWebviewEvent(webView: vscode.Webview) {
  new WebviewEvent(webView);
}
