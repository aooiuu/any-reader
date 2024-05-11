/**
 * 处理 webview 相关逻辑
 */

import * as path from 'path';
import { stringify } from 'qs';
import * as vscode from 'vscode';
import { ContentType } from '@any-reader/core';
import type { BookChapter } from '@any-reader/shared/localBookManager';
import * as localBookManager from '@any-reader/shared/localBookManager';
import { sleep } from '../utils/sleep';
import bookManager, { TreeNode } from '../sidebar/bookManager';
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
