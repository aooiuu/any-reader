import * as vscode from 'vscode';
import { stringify } from 'qs';
import { openExplorer } from 'explorer-opener';
import { Rule, RuleManager, SearchItem } from '@any-reader/core';
import { CONSTANTS } from '@any-reader/shared';
import { BookChapter, checkDir } from '@any-reader/shared/localBookManager';
import * as localBookManager from '@any-reader/shared/localBookManager';
import { COMMANDS, BOOK_SOURCE_PATH } from './constants';
import bookProvider from './treeview/book';
import historyProvider from './treeview/history';
import sourceProvider from './treeview/source';
import favoritesProvider from './treeview/favorites';
import localProvider from './treeview/localBook';
import bookManager from './treeview/bookManager';
import { treeItemDecorationProvider } from './treeview/TreeItemDecorationProvider';
import { webviewProvider } from './treeview/webviewProvider';
import * as ruleFileManager from './utils/ruleFileManager';
import historyManager from './utils/historyManager';
import favoritesManager from './utils/favoritesManager';
import { RecordFileRow } from './utils/RecordFile';
import { WebView } from './webview';
import { Config } from './config';

class App {
  private webView!: WebView;

  async activate(context: vscode.ExtensionContext) {
    this.webView = new WebView(context);

    // 初始化配置文件
    await Promise.all([ruleFileManager.init(), historyManager.init(), favoritesManager.init()]);

    // 注册命令
    const registerCommand = vscode.commands.registerCommand;
    [
      vscode.window.registerFileDecorationProvider(treeItemDecorationProvider),
      registerCommand(COMMANDS.editBookSource, this.editBookSource, this),
      registerCommand(COMMANDS.searchBook, this.searchBook, this),
      registerCommand(COMMANDS.getChapter, this.getChapter, this),
      registerCommand(COMMANDS.discover, this.discover, this),
      registerCommand(COMMANDS.searchBookByRule, this.searchBookByRule, this),
      registerCommand(COMMANDS.getContent, this.webView.getContent, this.webView),
      registerCommand(COMMANDS.openLocalBookDir, this.openLocalBookDir, this),
      registerCommand(COMMANDS.refreshLocalBooks, this.refreshLocalBooks, this),
      registerCommand(COMMANDS.getContentLocalBook, this.getContentLocalBook, this),
      registerCommand(COMMANDS.star, this.star, this),
      registerCommand(COMMANDS.unstar, this.unstar, this),
      registerCommand(COMMANDS.home, () => this.webView.navigateTo('/rules'), this.webView),
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
    // 侧边栏 - 本地
    vscode.window.createTreeView('any-reader-local', { treeDataProvider: localProvider });
    // 侧边栏 - webview
    webviewProvider.setExtensionPath(context.extensionPath);
    vscode.window.registerWebviewViewProvider('any-reader-webview', webviewProvider);

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

  /**
   * 获取章节
   */
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
        bookProvider.setChapters(chapterItems, rule, history.url);

        if (config?.saveHistory) {
          historyManager.add(config.saveHistory, rule);
          historyProvider.refresh();
        }
      }
    );
  }

  // 打开本地书籍目录
  openLocalBookDir() {
    checkDir();
    openExplorer(CONSTANTS.LOCAL_BOOK_DIR);
  }

  // 刷新本地目录
  refreshLocalBooks() {
    localProvider.refresh();
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

  // 阅读本地
  async getContentLocalBook(item: BookChapter) {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Window,
        title: 'loading...',
        cancellable: false
      },
      async () => {
        if (item.file.type === localBookManager.BOOK_TYPE.EPUB) {
          if (Config.readPageMode === 'Sidebar') {
            // 侧栏
            webviewProvider.navigateTo(
              '/content?' +
                stringify({
                  filePath: item.file.path,
                  chapterPath: item.path
                })
            );
          } else {
            // 编辑器
            this.webView.navigateTo(
              '/content?' +
                stringify({
                  filePath: item.file.path,
                  chapterPath: item.path
                })
            );
          }
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

export const app = new App();
