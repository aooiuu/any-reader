/**
 * webview 消息处理
 */

import * as os from 'node:os';
import * as path from 'node:path';
import * as vscode from 'vscode';
import openExplorer from 'explorer-opener';
import * as EasyPostMessage from 'easy-post-message';
import { CONSTANTS, api } from '@any-reader/shared';
import localBookManager from '@any-reader/shared/localBookManager';
import { COMMANDS } from '../constants';
import * as ruleFileManager from '../utils/ruleFileManager';
import { createAdapter } from '../utils/easyPostMessage';
import { getConfig } from '../utils/config';

export const ROOT_PATH = path.join(os.homedir(), '.any-reader');
export const CONFIG_PATH = path.join(ROOT_PATH, 'config.vscode.json');

function success(data: any, msg = '') {
  return {
    code: 0,
    data,
    msg
  };
}

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
    this._pm.answer('get@vscode/editBookSource', this._vscEditBookSource.bind(this));
    this._pm.answer('get@vscode/github', this._vscGithub.bind(this));
    this._pm.answer('get@vscode/openLocalBookDir', this._vscOpenLocalBookDir.bind(this));

    this._pm.answer('get@discoverMap', async ({ ruleId = '' } = {}) => success(await api.discoverMap(ruleId)));
    this._pm.answer('get@getFavorites', async () => success(await api.getFavorites()));
    this._pm.answer('get@getHistory', async () => success(await api.getHistory()));
    this._pm.answer('get@getLocalBooks', async () => success(await api.getLocalBooks(getConfig().bookDir)));
    this._pm.answer('post@discover', async (data: any) => success(await api.discover(data)));
    this._pm.answer('post@star', async (data: any) => success(await api.star(data)));
    this._pm.answer('post@unstar', async (data: any) => success(await api.unstar(data)));
    this._pm.answer('get@rules', () => success(api.rules()));
    this._pm.answer('get@getRuleById', ({ id = '' } = {}) => success(api.getRuleById(id)));
    this._pm.answer('post@createRule', async (data: any) => success(await api.createRule(data)));
    this._pm.answer('post@updateRule', async (data: any) => success(await api.updateRule(data)));
    this._pm.answer('post@searchByRuleId', async (data: any) => success(await api.searchByRuleId(data)));
    this._pm.answer('post@content', async (data: any) => success(await api.content(data)));
    this._pm.answer('post@getChapter', async (data: any) => success(await api.getChapter(data)));
    this._pm.answer('get@readConfig', async () => success(await api.readConfig(CONFIG_PATH)));
    this._pm.answer('post@updateConfig', async (data: any) => success(await api.updateConfig(CONFIG_PATH, data)));
  }

  // 打开本地书籍目录
  _vscOpenLocalBookDir() {
    localBookManager.checkDir(getConfig().bookDir || CONSTANTS.LOCAL_BOOK_DIR);
    openExplorer(getConfig().bookDir || CONSTANTS.LOCAL_BOOK_DIR);
  }

  // github
  private _vscGithub() {
    const doc = 'https://github.com/aooiuu/any-reader';
    vscode.commands.executeCommand('vscode.open', doc);
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

  // 编辑规则
  private _vscEditBookSource() {
    vscode.commands.executeCommand(COMMANDS.editBookSource);
  }
}
