import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { RuleManager } from '@any-reader/core';
import { getBookSource, setBookSource } from '../dataManager';
import { TreeNode } from '../treeview/bookManager';

export class WebView {
  mSearchToken: any;
  webviewPanel: any;
  context: vscode.ExtensionContext;

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

  initWebviewPanel(title: string) {
    if (!this.webviewPanel) {
      this.webviewPanel = vscode.window.createWebviewPanel('rss', title, vscode.ViewColumn.One, {
        retainContextWhenHidden: true,
        enableScripts: true
      });
      this.webviewPanel.onDidDispose(
        () => {
          this.webviewPanel = undefined;
        },
        this,
        this.context!.subscriptions
      );
    } else {
      this.webviewPanel.title = title;
    }

    this.webviewPanel.webview.onDidReceiveMessage(async (message: any) => {
      const { type, data } = message;

      switch (type) {
        case 'setRule':
          {
            const rules = await getBookSource();
            const row = rules.find((e) => e.id === data.row.id);
            if (row) {
              Object.assign(row, data.newRow);
            }
            await setBookSource(rules);
            this.webviewPanel!.webview.postMessage({
              type: 'sendToWebview',
              data: {
                type: 'getBookSource',
                data: await getBookSource()
              }
            });
          }
          break;
        case 'getBookSource':
          this.webviewPanel!.webview.postMessage({
            type: 'sendToWebview',
            data: {
              type,
              data: await getBookSource()
            }
          });
          break;
        case 'search':
          {
            const { uuid, keyword } = data;
            this.mSearchToken = uuid;
            const rules = await getBookSource();
            for (const rule of rules) {
              if (this.mSearchToken !== uuid) {
                return;
              }
              const analyzer = new RuleManager(rule);
              const searchItems = await analyzer.search(keyword).catch(() => []);
              if (searchItems.length) {
                this.webviewPanel!.webview.postMessage({
                  type: 'sendToWebview',
                  data: {
                    type,
                    data: {
                      uuid,
                      rule,
                      list: searchItems
                    }
                  }
                });
              }
            }
          }
          break;

        default:
          break;
      }
    });
  }

  async openHome() {
    this.initWebviewPanel('Home');
    this.webviewPanel!.webview.html = this.getWebViewContent(path.join('template-dist', 'index.html'));
    // this.webviewPanel!.webview.html = `
    // <style>
    // html,
    // body,
    // iframe {
    //   width: 100%;
    //   height: 100%;
    //   padding: 0;
    //   margin: 0;
    // }
    // iframe {
    //   border: none;
    // }
    // </style>
    // <iframe id="app" src="http://localhost:8899/" sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-downloads" allow="cross-origin-isolated; clipboard-read; clipboard-write;"></iframe>
    // `;
    this.webviewPanel!.reveal();
  }

  // 打开阅读面板
  async openWebviewPanel(article: TreeNode, content: string) {
    const title: string = article.data.name;
    this.initWebviewPanel(title);
    this.webviewPanel!.webview.html = content;
    this.webviewPanel!.reveal();
  }
}
