import * as vscode from 'vscode';
import { ContentType, Rule, RuleManager, SearchItem } from '@any-reader/core';
import { COMMANDS, BOOK_SOURCE_PATH } from './constants';
import { config } from './config';
import bookProvider from './treeview/book';
import historyProvider from './treeview/history';
import sourceProvider from './treeview/source';
import favoritesProvider from './treeview/favorites';
import bookManager, { TreeNode } from './treeview/bookManager';
import { treeItemDecorationProvider } from './treeview/TreeItemDecorationProvider';
import * as ruleFileManager from './utils/ruleFileManager';
import historyManager from './utils/historyManager';
import favoritesManager from './utils/favoritesManager';
import { RecordFileRow } from './utils/RecordFile';
import { WebView } from './webview';

class App {
  private webView!: WebView;

  async activate(context: vscode.ExtensionContext) {
    this.webView = new WebView(context);

    // 初始化配置文件
    await Promise.all([ruleFileManager.init(), historyManager.init(), favoritesManager.init()]);

    const registerCommand = vscode.commands.registerCommand;
    [
      vscode.window.registerFileDecorationProvider(treeItemDecorationProvider),
      registerCommand(COMMANDS.editBookSource, this.editBookSource, this),
      registerCommand(COMMANDS.searchBook, this.searchBook, this),
      registerCommand(COMMANDS.getChapter, this.getChapter, this),
      registerCommand(COMMANDS.discover, this.discover, this),
      registerCommand(COMMANDS.searchBookByRule, this.searchBookByRule, this),
      registerCommand(COMMANDS.getContent, this.getContent, this),
      registerCommand(COMMANDS.star, this.star, this),
      registerCommand(COMMANDS.unstar, this.unstar, this),
      registerCommand(COMMANDS.home, () => this.webView.navigateTo('/'), this.webView),
      registerCommand(COMMANDS.getBookSource, this.getBookSource, this),
      registerCommand(
        COMMANDS.historyRefresh,
        () => {
          historyProvider.refresh();
        },
        this
      ),
      registerCommand(
        COMMANDS.favoritesRefresh,
        () => {
          favoritesProvider.refresh();
        },
        this
      ),
      registerCommand(COMMANDS.gamePlay, (node: any) => this.webView.navigateTo('/iframe?url=' + node.host, node.name), this.webView)
    ].forEach((command) => context.subscriptions.push(command));
    // 侧边栏 - 规则
    vscode.window.createTreeView('any-reader-source', { treeDataProvider: sourceProvider });
    // 侧边栏 - 阅读
    vscode.window.createTreeView('any-reader-book', { treeDataProvider: bookProvider });
    // 侧边栏 - 历史
    vscode.window.createTreeView('any-reader-history', { treeDataProvider: historyProvider });
    // 侧边栏 - 收藏
    vscode.window.createTreeView('any-reader-favorites', { treeDataProvider: favoritesProvider });
    vscode.commands.executeCommand(COMMANDS.getBookSource);
  }

  // 书源编辑
  editBookSource() {
    vscode.workspace.openTextDocument(vscode.Uri.file(BOOK_SOURCE_PATH)).then((doc) => {
      vscode.window.showTextDocument(doc);
    });
  }

  // 搜索
  async searchBook() {
    this.webView.navigateTo('/search');
  }

  // 发现页
  discover() {
    this.webView.navigateTo('/discover');
  }

  // 根据规则搜索内容
  async searchBookByRule(rule: Rule) {
    await bookManager.searchBook(rule);
    bookProvider.refresh();
  }

  // 获取章节
  async getChapter(history: RecordFileRow, config: { saveHistory: SearchItem }) {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Window,
        title: 'loading...',
        cancellable: false
      },
      async () => {
        const rule = await ruleFileManager.findById(history.ruleId);
        const ruleManager = new RuleManager(rule);
        const chapterItems = await ruleManager.getChapter(history.url);

        bookManager.list = chapterItems.map((chapterItem: any) => ({
          rule,
          type: 2,
          data: chapterItem
        }));
        bookProvider.refresh();

        if (config?.saveHistory) {
          historyManager.add(config.saveHistory, rule);
          historyProvider.refresh();
        }
      }
    );
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
        const textArr = await bookManager.getContent(article);
        if (!textArr?.length) {
          vscode.window.showWarningMessage('empty content');
        } else {
          let content = '';
          if (article.rule.contentType === ContentType.VIDEO) {
            this.webView.navigateTo('/player?url=' + textArr[0]);
          } else if (article.rule.contentType === ContentType.MANGA) {
            content = textArr.map((src) => `<img src="${src}"/>`).join('');
          } else {
            content = textArr.join('');
          }

          if (config.app.get('hideImage', false)) {
            content = content.replace(/<img .*?>/gim, '');
          }
          const injectedHtml = config.app.get('injectedHtml', '');
          content && this.webView.openWebviewPanel(article, `${injectedHtml}<style>body{font-size:1em}</style>${content}`);
        }
      }
    );
  }

  // 获取本地书源列表
  async getBookSource() {
    sourceProvider.refresh();
  }

  // 收藏
  star(arg: any) {
    favoritesManager.add(arg.data, arg.rule);
    bookProvider.refresh();
    favoritesProvider.refresh();
  }

  // 取消收藏
  unstar(arg: any) {
    favoritesManager.del(arg.data, arg.rule);
    bookProvider.refresh();
    favoritesProvider.refresh();
  }
}

export const app = new App();
