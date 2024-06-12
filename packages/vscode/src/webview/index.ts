/**
 * 处理 webview 相关逻辑
 */

import * as path from 'path';
import * as vscode from 'vscode';
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
        this.webviewPanel!.webview,
        `window.__vscode$initialize_page = '${routePath}'`
      );
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
}
