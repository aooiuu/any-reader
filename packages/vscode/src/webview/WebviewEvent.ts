/**
 * webview 消息处理
 */

import * as vscode from 'vscode';
import * as EasyPostMessage from 'easy-post-message';
import { ContentType, Rule, RuleManager } from '@any-reader/core';
import { CONSTANTS } from '@any-reader/shared';
import * as localBookManager from '@any-reader/shared/localBookManager';
import type { BookChapter } from '@any-reader/shared/localBookManager';
import { COMMANDS } from '../constants';
import * as ruleFileManager from '../utils/ruleFileManager';
import { createAdapter } from '../utils/easyPostMessage';
import favoritesProvider from '../sidebar/favorites';
import favoritesManager from '../utils/favoritesManager';
import historyManager from '../utils/historyManager';
import openExplorer from 'explorer-opener';

function success(data: any, msg = '') {
  return {
    code: 0,
    data,
    msg
  };
}

/**
 * 转换为 BookChapter
 * @param filePath 文件路径
 * @param chapterPath 章节路径
 * @returns
 */
function toBookChapter(filePath: string, chapterPath: string): BookChapter {
  return {
    file: {
      path: filePath,
      type: localBookManager.getBookType(filePath),
      name: ''
    },
    name: '',
    path: chapterPath
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

    this._pm.answer('get@discoverMap', this._discoverMap.bind(this));
    this._pm.answer('get@getFavorites', this._getFavorites.bind(this));
    this._pm.answer('get@getHistory', this._getHistory.bind(this));
    this._pm.answer('get@getLocalBooks', this._getLocalBooks.bind(this));
    this._pm.answer('post@discover', this._discover.bind(this));
    this._pm.answer('post@star', this._star.bind(this));
    this._pm.answer('post@unstar', this._unstar.bind(this));
    this._pm.answer('get@rules', this._rules.bind(this));
    this._pm.answer('get@getRuleById', this._getRuleById.bind(this));
    this._pm.answer('post@createRule', this._createRule.bind(this));
    this._pm.answer('post@updateRule', this._updateRule.bind(this));
    this._pm.answer('post@searchByRuleId', this._searchByRuleId.bind(this));
    this._pm.answer('post@content', this._content.bind(this));
    this._pm.answer('post@getChapter', this._getChapter.bind(this));
  }

  // 打开本地书籍目录
  _vscOpenLocalBookDir() {
    localBookManager.checkDir();
    openExplorer(CONSTANTS.LOCAL_BOOK_DIR);
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

  // 获取所有规则
  private _rules() {
    return success(ruleFileManager.list());
  }

  // 获取单个规则
  private _getRuleById(data: Rule) {
    const rules = ruleFileManager.list();
    return success(rules.find((e) => e.id === data.id));
  }

  // 添加规则
  private _createRule(data: Rule) {
    ruleFileManager.update(data);
  }

  // 更新规则
  private async _updateRule(data: Rule) {
    await ruleFileManager.update(data);
    return success(data);
  }

  // 搜索
  private async _searchByRuleId({ ruleId, keyword }: { ruleId: string; keyword: string }) {
    const rule = await ruleFileManager.findById(ruleId);
    const analyzer = new RuleManager(rule);
    return success(await analyzer.search(keyword).catch(() => []));
  }

  // 获取分类
  private async _discoverMap(data: any) {
    const rule = await ruleFileManager.findById(data.ruleId);
    const ruleManager = new RuleManager(rule);
    return success(await ruleManager.discoverMap());
  }

  // 获取分类下内容
  private async _discover(data: any) {
    const rule = await ruleFileManager.findById(data.ruleId);
    const ruleManager = new RuleManager(rule);
    return success(await ruleManager.discover(data.data.value));
  }

  // 获取收藏列表
  private async _getFavorites() {
    return success(await favoritesManager.list());
  }

  // 获取历史
  private async _getHistory() {
    return success(await historyManager.list());
  }

  // 本地
  private async _getLocalBooks() {
    return success(await localBookManager.getBookList());
  }

  // 收藏
  private async _star({ data, ruleId }: any) {
    await favoritesManager.add(data, await ruleFileManager.findById(ruleId));
    favoritesProvider.refresh();
    return success(true);
  }

  // 取消收藏
  private async _unstar({ data, ruleId }: any) {
    await favoritesManager.del(data, await ruleFileManager.findById(ruleId));
    favoritesProvider.refresh();
    return success(true);
  }

  // 获取章节列表
  private async _getChapter({ filePath = '', ruleId = undefined } = {}) {
    if (ruleId) {
      const rule = await ruleFileManager.findById(ruleId);
      const rm = new RuleManager(rule);
      const list = await rm.getChapter(filePath);
      return success(
        list.map((e) => ({
          ...e,
          name: e.name,
          path: e.url
        }))
      );
    }
    // 本地
    return success(await localBookManager.getChapter(filePath));
  }

  // 获取章节内容
  private async _content({ filePath, chapterPath, ruleId }: any) {
    // 在线
    if (ruleId) {
      const rule = await ruleFileManager.findById(ruleId);
      const rm = new RuleManager(rule);
      const content = await rm.getContent(chapterPath);
      let text = '';
      if (rule.contentType === ContentType.MANGA) {
        text = content.map((src) => `<img src="${src}"/>`).join('');
      } else {
        text = content.join('');
      }
      return success({
        content: text
      });
    }
    // 本地
    const content = await localBookManager.getContent(toBookChapter(filePath, chapterPath));
    return success({
      content
    });
  }
}
