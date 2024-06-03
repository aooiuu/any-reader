/**
 * 处理 webview 相关逻辑
 */

import * as path from 'path';
import { stringify } from 'qs';
import * as vscode from 'vscode';
import { BookChapter, BOOK_TYPE, getBookType } from '@any-reader/shared/localBookManager';
import { sleep } from '../utils/sleep';
import { WebviewEvent } from './WebviewEvent';
import { getWebViewContent } from '../utils/webview';

export class WebView {
  private webviewPanel?: vscode.WebviewPanel;
  private context: vscode.ExtensionContext;
  private isVue = false;
  private pm!: any;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  async navigateTo(routePath = '', title = 'AnyReader') {
    this.initWebviewPanel(title);
    if (!this.isVue) {
      this.webviewPanel!.webview.html = getWebViewContent(
        path.join('template-dist', 'index.html'),
        this.context.extensionPath,
        this.webviewPanel!.webview
      );
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
      const we = new WebviewEvent(this.webviewPanel.webview);
      this.pm = we.pm;
    }
    this.webviewPanel.title = title;
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
        if (getBookType(item.filePath) === BOOK_TYPE.EPUB) {
          this.navigateTo(
            '/content?' +
              stringify({
                filePath: item.filePath,
                chapterPath: item.chapterPath
              })
          );
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
