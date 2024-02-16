import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidV4 } from 'uuid';
import * as vscode from 'vscode';
import { RuleManager } from '@any-reader/core';
import { getBookSource, setBookSource } from '../dataManager';
import { TreeNode } from '../treeview/bookManager';

export class WebView {
  private mSearchToken: any;
  private webviewPanel?: vscode.WebviewPanel;
  private context: vscode.ExtensionContext;
  private isVue = false;

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
    } else {
      this.webviewPanel.title = title;
    }

    this.webviewPanel.webview.onDidReceiveMessage(async (message: any) => {
      const { type, data } = message;

      switch (type) {
        case 'getRule':
          {
            const rules = await getBookSource();
            this.webviewPanel!.webview.postMessage({
              type: 'getRule',
              data: rules.find((e) => e.id === data.id)
            });
          }
          break;
        case 'addRule':
          {
            let rules = await getBookSource();
            if (!data.id) {
              data.id = uuidV4();
              rules.push(data);
            } else {
              rules = rules.filter((r) => r.id !== data.id);
              rules.push(data);
            }
            setBookSource(rules);
          }
          break;
        case 'setRule':
          {
            const rules = await getBookSource();
            const row = rules.find((e) => e.id === data.row.id);
            if (row) {
              Object.assign(row, data.newRow);
            }
            await setBookSource(rules);
            this.webviewPanel!.webview.postMessage({
              type: 'getBookSource',
              data: await getBookSource()
            });
          }
          break;
        case 'getBookSource':
          this.webviewPanel!.webview.postMessage({
            type,
            data: await getBookSource()
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
                  type,
                  data: {
                    uuid,
                    rule,
                    list: searchItems
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

  async navigateTo(routePath = '', title = 'Home') {
    this.initWebviewPanel(title);
    if (!this.isVue) {
      this.webviewPanel!.webview.html = this.getWebViewContent(path.join('template-dist', 'index.html'));
    }
    this.webviewPanel!.webview.postMessage({
      type: 'router.push',
      data: routePath
    });
    this.isVue = true;
    this.webviewPanel!.reveal();
  }

  // 打开阅读面板
  async openWebviewPanel(article: TreeNode, content: string) {
    this.isVue = false;
    const title: string = article.data.name;
    this.initWebviewPanel(title);
    this.webviewPanel!.webview.html = content;
    this.webviewPanel!.reveal();
  }
}
