import * as vscode from 'vscode';
import { ContentType, Rule } from '@any-reader/core';
import { COMMANDS } from './constants';
import { config } from './config';
import { BookProvider } from './treeview/book';
import { SourceProvider } from './treeview/source';
import bookManager, { TreeNode } from './treeview/bookManager';
import sourceManager from './treeview/sourceManager';
import { treeItemDecorationProvider } from './treeview/TreeItemDecorationProvider';
import { BOOK_SOURCE_PATH, ensureFile } from './dataManager';
import { WebView } from './webview';

class App {
  private bookProvider: BookProvider = new BookProvider();
  private sourceProvider: SourceProvider = new SourceProvider();
  private webView!: WebView;

  activate(context: vscode.ExtensionContext) {
    this.webView = new WebView(context);
    ensureFile();

    const registerCommand = vscode.commands.registerCommand;
    [
      vscode.window.registerFileDecorationProvider(treeItemDecorationProvider),
      registerCommand(COMMANDS.editBookSource, this.editBookSource, this),
      registerCommand(COMMANDS.searchBook, this.searchBook, this),
      registerCommand(COMMANDS.getContent, this.getContent, this),
      registerCommand(COMMANDS.home, () => this.webView.navigateTo('/'), this.webView),
      registerCommand(COMMANDS.getBookSource, this.getBookSource, this),
      registerCommand(COMMANDS.gamePlay, (node: any) => this.webView.navigateTo('/iframe?url=' + node.host, node.name), this.webView)
    ].forEach((command) => context.subscriptions.push(command));
    vscode.window.createTreeView('any-reader-book', { treeDataProvider: this.bookProvider });
    vscode.window.createTreeView('any-reader-source', { treeDataProvider: this.sourceProvider });
    vscode.commands.executeCommand(COMMANDS.getBookSource);
  }

  // 书源编辑
  editBookSource() {
    vscode.workspace.openTextDocument(vscode.Uri.file(BOOK_SOURCE_PATH)).then((doc) => {
      vscode.window.showTextDocument(doc);
    });
  }

  // 搜索
  async searchBook(rule?: Rule) {
    await bookManager.searchBook(rule);
    this.bookProvider.refresh();
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
  public async getBookSource() {
    sourceManager.getBookSource();
    this.sourceProvider.refresh();
  }
}

export const app = new App();
