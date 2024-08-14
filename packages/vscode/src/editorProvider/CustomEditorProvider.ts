import * as path from 'node:path';
import { stringify } from 'qs';
import * as vscode from 'vscode';
import { getWebViewContent } from '../utils/webview';
import { useWebviewEvent } from '../webview/WebviewEvent';

export class CustomEditorProvider implements vscode.CustomReadonlyEditorProvider {
  webviewPanel!: vscode.WebviewPanel;
  private _context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this._context = context;
  }

  openCustomDocument(
    uri: vscode.Uri,
    _openContext: vscode.CustomDocumentOpenContext,
    _token: vscode.CancellationToken
  ): vscode.CustomDocument | Thenable<vscode.CustomDocument> {
    return new CustomEditorDocument(uri);
  }

  resolveCustomEditor(document: vscode.CustomDocument, webviewPanel: vscode.WebviewPanel, _token: vscode.CancellationToken): void | Thenable<void> {
    this.webviewPanel = webviewPanel;
    this.webviewPanel.webview.options = {
      enableScripts: true
    };

    // 绑定事件
    useWebviewEvent(this.webviewPanel.webview, this._context.extensionPath);

    // 打开模板
    this.navigateTo(
      '/chapter?' +
        stringify({
          filePath: document.uri.fsPath
        })
    );
  }

  // 跳转到地址
  async navigateTo(routePath = '') {
    this.webviewPanel!.webview.html = getWebViewContent(
      path.join('template-dist', 'index.html'),
      this._context.extensionPath,
      this.webviewPanel!.webview,
      `window.__vscode$initialize_page = '${routePath}'`
    );
    this.webviewPanel!.reveal();
  }
}

class CustomEditorDocument implements vscode.CustomDocument {
  _uri!: vscode.Uri;

  constructor(uri: vscode.Uri) {
    this._uri = uri;
  }

  get uri() {
    return this._uri;
  }

  dispose(): void {}
}
