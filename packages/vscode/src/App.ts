import * as vscode from 'vscode';
import { stringify } from 'qs';
import { openExplorer } from 'explorer-opener';
import { SearchItem } from '@any-reader/core';
import { CONSTANTS, api, ruleFileManager, favoritesManager, historyManager } from '@any-reader/shared';
import { BookChapter, BOOK_TYPE, getBookType } from '@any-reader/shared/localBookManager';
import localBookManager from '@any-reader/shared/localBookManager';
import { COMMANDS, BOOK_SOURCE_PATH } from './constants';
import { webviewProvider } from './sidebar/webviewProvider';
import { WebView } from './webview';
import { Config } from './config';
import { getConfig } from './utils/config';

class App {
  private webView!: WebView;

  async activate(context: vscode.ExtensionContext) {
    this.webView = new WebView(context);

    // 初始化配置文件
    await Promise.all([api.init(), ruleFileManager.init(), historyManager.init(), favoritesManager.init()]);

    // 注册命令
    const registerCommand = vscode.commands.registerCommand;
    [
      registerCommand(COMMANDS.editBookSource, this.editBookSource, this),
      registerCommand(COMMANDS.searchBook, this.searchBook, this),
      registerCommand(COMMANDS.getChapter, this.getChapter, this),
      registerCommand(COMMANDS.discover, this.discover, this),
      registerCommand(COMMANDS.openUrl, this.openUrl, this),
      registerCommand(COMMANDS.openLocalBookDir, this.openLocalBookDir, this),
      registerCommand(COMMANDS.home, () => this.webView.navigateTo('/rules'), this.webView),
      registerCommand(COMMANDS.gamePlay, (node: any) => this.webView.navigateTo('/iframe?url=' + node.host, node.name), this.webView)
    ].forEach((command) => context.subscriptions.push(command));

    // 侧边栏 - webview
    webviewProvider.setExtensionPath(context.extensionPath);
    vscode.window.registerWebviewViewProvider('any-reader-webview', webviewProvider);
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

  // 打开链接
  openUrl(url: string) {
    this.webView.navigateTo(url);
  }

  /**
   * 获取章节
   */
  async getChapter(history: any, config: { saveHistory: SearchItem }) {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Window,
        title: 'loading...',
        cancellable: false
      },
      async () => {
        webviewProvider.navigateTo(
          '/chapter?' +
            stringify({
              ...history,
              filePath: history.url
            })
        );
        const rule = await ruleFileManager.findById(history.ruleId);
        if (config?.saveHistory) {
          historyManager.add(config.saveHistory, rule);
        }
      }
    );
  }

  // 打开本地书籍目录
  openLocalBookDir() {
    localBookManager.checkDir(getConfig().bookDir || CONSTANTS.LOCAL_BOOK_DIR);
    openExplorer(getConfig().bookDir || CONSTANTS.LOCAL_BOOK_DIR);
  }

  // 收藏
  star(arg: any) {
    favoritesManager.add(arg.data, arg.rule);
  }

  // 取消收藏
  unstar(arg: any) {
    favoritesManager.del(arg.data, arg.rule);
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
        if (getBookType(item.filePath) === BOOK_TYPE.EPUB) {
          if (Config.readPageMode === 'Sidebar') {
            // 侧栏
            webviewProvider.navigateTo(
              '/content?' +
                stringify({
                  filePath: item.filePath,
                  chapterPath: item.chapterPath
                })
            );
          } else {
            // 编辑器
            this.webView.navigateTo(
              '/content?' +
                stringify({
                  filePath: item.filePath,
                  chapterPath: item.chapterPath
                })
            );
          }
        } else {
          // TODO: TXT 数据太大, 分章处理?
          const openPath = vscode.Uri.file(item.filePath);
          // vscode.window.showTextDocument(openPath);
          vscode.commands.executeCommand('vscode.open', openPath);
        }
      }
    );
  }
}

export const app = new App();
