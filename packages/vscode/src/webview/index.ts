/**
 * 处理 webview 相关逻辑
 */

import * as path from 'path';
import * as fs from 'fs';
import { stringify } from 'qs';
import * as vscode from 'vscode';
import * as EasyPostMessage from 'easy-post-message';
import { ContentType, Rule, RuleManager } from '@any-reader/core';
import type { BookChapter } from '@any-reader/shared/localBookManager';
import * as localBookManager from '@any-reader/shared/localBookManager';
import { config } from '../config';
import { COMMANDS } from '../constants';
import * as ruleFileManager from '../utils/ruleFileManager';
import { createAdapter } from '../utils/easyPostMessage';
import favoritesProvider from '../treeview/favorites';
import localBook from '../treeview/localBook';
import book from '../treeview/book';
import favoritesManager from '../utils/favoritesManager';
import { sleep } from '../utils/sleep';
import bookManager, { TreeNode } from '../treeview/bookManager';

export enum WebViewFileBook {
  None = 0,
  WebViewFileOnline = 1,
  WebViewFileLocal = 2
}

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

export class WebView {
  private webviewPanel?: vscode.WebviewPanel;
  private context: vscode.ExtensionContext;
  private isVue = false;
  private pm!: any;
  private webViewFileBook: WebViewFileBook = WebViewFileBook.None;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  getWebViewContent(templatePath: string) {
    const resourcePath = path.join(this.context!.extensionPath, templatePath);
    const dirPath = path.dirname(resourcePath);
    const html = fs.readFileSync(resourcePath, 'utf-8').replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(\.\/.+?)"/g, (m, $1, $2) => {
      return $1 + this.webviewPanel!.webview.asWebviewUri(vscode.Uri.file(path.resolve(dirPath, $2))) + '"';
    });
    return html;
  }

  async navigateTo(routePath = '', title = 'AnyReader') {
    this.initWebviewPanel(title);
    if (!this.isVue) {
      this.webviewPanel!.webview.html = this.getWebViewContent(path.join('template-dist', 'index.html'));
      // TODO: 第一次打开是没有就绪
      await sleep(500);
    }
    this.pm.emit('router.push', routePath, this.webviewPanel?.webview);
    this.isVue = true;
    this.webviewPanel!.reveal();
  }

  // 打开阅读面板
  async openWebviewPanel(title: string, content: string) {
    this.isVue = false;
    this.initWebviewPanel(title);
    this.webviewPanel!.webview.html = content;
    this.webviewPanel!.reveal();
  }

  openWebviewPanelText(title: string, content: string) {
    if (!content) {
      return;
    }
    if (config.app.get('hideImage', false)) {
      content = content.replace(/<img .*?>/gim, '');
    }
    const injectedHtml = config.app.get('injectedHtml', '');
    const css = `
    html,
    body {
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
    }
    body {
      font-size: 1em;
    }
    p {
      margin: 0;
      padding: 0;
    }
    `;
    this.openWebviewPanel(
      title,
      `${injectedHtml}<style>${css}</style><div style="white-space: pre-wrap; height: 100%; width: 100%; padding: 10px
      ; box-sizing: border-box;">${content}</div>`
    );
  }

  // 获取章节
  async _vscGetChapter(data: any) {
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
  _vscEditBookSource() {
    vscode.commands.executeCommand(COMMANDS.editBookSource);
  }

  // 获取所有规则
  _rules() {
    return success(ruleFileManager.list());
  }

  // 获取单个规则
  _getRuleById(data: Rule) {
    const rules = ruleFileManager.list();
    return success(rules.find((e) => e.id === data.id));
  }

  // 添加规则
  _createRule(data: Rule) {
    ruleFileManager.update(data);
  }

  // 更新规则
  async _updateRule(data: Rule) {
    await ruleFileManager.update(data);
    return success(data);
  }

  // 搜索
  async _searchByRuleId({ ruleId, keyword }: { ruleId: string; keyword: string }) {
    const rule = await ruleFileManager.findById(ruleId);
    const analyzer = new RuleManager(rule);
    return success(await analyzer.search(keyword).catch(() => []));
  }

  // 获取分类
  async _discoverMap(data: any) {
    const rule = await ruleFileManager.findById(data.ruleId);
    const ruleManager = new RuleManager(rule);
    return success(await ruleManager.discoverMap());
  }

  // 获取分类下内容
  async _discover(data: any) {
    const rule = await ruleFileManager.findById(data.ruleId);
    const ruleManager = new RuleManager(rule);
    return success(await ruleManager.discover(data.data.value));
  }

  // 获取收藏列表
  async _getFavorites() {
    return success(await favoritesManager.list());
  }

  // 收藏
  async _star({ data, ruleId }: any) {
    await favoritesManager.add(data, await ruleFileManager.findById(ruleId));
    favoritesProvider.refresh();
    return success(true);
  }

  // 取消收藏
  async _unstar({ data, ruleId }: any) {
    await favoritesManager.del(data, await ruleFileManager.findById(ruleId));
    favoritesProvider.refresh();
    return success(true);
  }

  // 获取章节列表
  async _getChapter({ filePath = '', ruleId = undefined } = {}) {
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
  async _content({ filePath, chapterPath, ruleId }: any) {
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
        // ...this.getOtherChapter(filePath, chapterPath, ruleId)
      });
    }
    // 本地
    const content = await localBookManager.getContent(toBookChapter(filePath, chapterPath));
    return success({
      content
      // ...this.getOtherChapter(filePath, chapterPath)
    });
  }

  /**
   * 获取章节
   * @deprecated 这里处理起来有点繁琐, 也许应该把全部章节数据存放在Webview
   */
  getOtherChapter(filePath: string, chapterPath: string, ruleId?: string) {
    if (this.webViewFileBook === WebViewFileBook.WebViewFileOnline) {
      const chapters = book.getChildrenCache(ruleId ?? '', filePath);
      if (!chapters.length) {
        return {};
      }
      const idx = chapters.findIndex((e: any) => e.data.url === chapterPath);
      const lastChapter = idx === 0 ? null : chapters[idx - 1];
      const nextChapterIdx = idx + 1;
      const nextChapter = chapters.length - 1 < nextChapterIdx ? null : chapters[nextChapterIdx];
      return {
        lastChapter: lastChapter?.data?.url,
        nextChapter: nextChapter?.data?.url
      };
    } else if (this.webViewFileBook === WebViewFileBook.WebViewFileLocal) {
      const chapters = localBook.getChildrenCache(filePath);
      if (!chapters.length) {
        return {};
      }
      const idx = chapters.findIndex((e: any) => e.path === chapterPath);
      const lastChapter = idx === 0 ? null : chapters[idx - 1];
      const nextChapterIdx = idx + 1;
      const nextChapter = chapters.length - 1 < nextChapterIdx ? null : chapters[nextChapterIdx];
      return {
        lastChapter: lastChapter?.path,
        nextChapter: nextChapter?.path
      };
    }

    return {};
  }

  /**
   * 初始化 WebView
   * @param {string} title 标题
   */
  initWebviewPanel(title: string) {
    if (!this.webviewPanel) {
      this.webviewPanel = vscode.window.createWebviewPanel('any-reader', title, vscode.ViewColumn.One, {
        retainContextWhenHidden: true,
        enableScripts: true
      });
      this.webviewPanel.onDidDispose(
        () => {
          this.webviewPanel = undefined;
          this.isVue = false;
        },
        this,
        this.context!.subscriptions
      );
      // @ts-ignore
      this.pm = new EasyPostMessage(createAdapter(this.webviewPanel.webview));

      // 消息通信, 为了以后兼容 XHR, 模板分离出独立可运行浏览器版本

      // vsc
      this.pm.answer('post@vscode/getChapter', this._vscGetChapter.bind(this));
      this.pm.answer('get@vscode/editBookSource', this._vscEditBookSource.bind(this));

      this.pm.answer('get@discoverMap', this._discoverMap.bind(this));
      this.pm.answer('get@getFavorites', this._getFavorites.bind(this));
      this.pm.answer('post@discover', this._discover.bind(this));
      this.pm.answer('post@star', this._star.bind(this));
      this.pm.answer('post@unstar', this._unstar.bind(this));
      this.pm.answer('get@rules', this._rules.bind(this));
      this.pm.answer('get@getRuleById', this._getRuleById.bind(this));
      this.pm.answer('post@createRule', this._createRule.bind(this));
      this.pm.answer('post@updateRule', this._updateRule.bind(this));
      this.pm.answer('post@searchByRuleId', this._searchByRuleId.bind(this));
      this.pm.answer('post@content', this._content.bind(this));
      this.pm.answer('post@getChapter', this._getChapter.bind(this));
    }
    this.webviewPanel.title = title;
  }

  // 获取文章详情
  async getContent(article: TreeNode) {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Window,
        title: 'loading...',
        cancellable: false
      },
      async () => {
        const contentType = article.rule.contentType;
        // 视频
        if (contentType === ContentType.VIDEO) {
          const textArr = await bookManager.getContent(article);
          if (!textArr?.length) {
            vscode.window.showWarningMessage('empty content');
          }
          this.navigateTo('/player?url=' + textArr[0]);
          return;
        }

        // TODO: 漫画模板待优化
        // 小说
        if ([ContentType.MANGA, ContentType.NOVEL, ContentType.NOVELMORE].includes(contentType)) {
          this.webViewFileBook = WebViewFileBook.WebViewFileOnline;
          this.navigateTo(
            '/content?' +
              stringify({
                ruleId: article.rule.id,
                filePath: article.url,
                chapterPath: article.data.url
              })
            // article.data.name
          );
        }
      }
    );
  }

  // 阅读本地书籍
  async getContentLocalBook(item: BookChapter) {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Window,
        title: 'loading...',
        cancellable: false
      },
      async () => {
        if (item.file.type === localBookManager.BOOK_TYPE.EPUB) {
          this.webViewFileBook = WebViewFileBook.WebViewFileLocal;
          this.navigateTo(
            '/content?' +
              stringify({
                filePath: item.file.path,
                chapterPath: item.path
              })
          );
        } else {
          // TODO: TXT 数据太大, 分章处理?
          const openPath = vscode.Uri.file(item.file.path);
          // vscode.window.showTextDocument(openPath);
          vscode.commands.executeCommand('vscode.open', openPath);
        }
      }
    );
  }
}
