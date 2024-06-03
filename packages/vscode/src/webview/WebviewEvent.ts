/**
 * webview 消息处理
 */

import * as os from 'node:os';
import * as path from 'node:path';
import * as vscode from 'vscode';
import openExplorer from 'explorer-opener';
import * as EasyPostMessage from 'easy-post-message';
import { CONSTANTS, api, ruleFileManager } from '@any-reader/shared';
import localBookManager from '@any-reader/shared/localBookManager';
import { COMMANDS } from '../constants';
import { createAdapter } from '../utils/easyPostMessage';
import { getConfig } from '../utils/config';

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
    this._pm.answer('post@vscode/getChapter', this._vscGetChapter.bind(this));
    this._pm.answer('post@vscode/executeCommand', this.executeCommand.bind(this));
    this._pm.answer('get@vscode/openLocalBookDir', this._vscOpenLocalBookDir.bind(this));

    // 初始化通用接口
    api.useApi(this._pm.answer.bind(this._pm), {
      CONFIG_PATH,
      bookDir: getConfig().bookDir
    });
  }

  // 打开本地书籍目录
  _vscOpenLocalBookDir() {
    localBookManager.checkDir(getConfig().bookDir || CONSTANTS.LOCAL_BOOK_DIR);
    openExplorer(getConfig().bookDir || CONSTANTS.LOCAL_BOOK_DIR);
  }

  private executeCommand({ command, data }: any) {
    const args = Array.isArray(data) ? data : typeof data === 'object' ? [data] : [];
    vscode.commands.executeCommand(command, ...args);
  }

  // 获取章节
  private async _vscGetChapter(data: any) {
    const { ruleId, data: searchItem } = data;
    const rule = await ruleFileManager.findById(ruleId);
    vscode.commands.executeCommand(
      COMMANDS.getChapter,
      {
        ...searchItem,
        ruleId: rule.id
      },
      {
        saveHistory: searchItem
      }
    );
  }
}
