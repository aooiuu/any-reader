import * as path from 'path';
import * as vscode from 'vscode';
import { getWebViewContent } from '../utils/webview';
import { useWebviewEvent, WebviewEvent } from '../webview/WebviewEvent';

export class WebviewProvider implements vscode.WebviewViewProvider {
  private _webviewView!: vscode.WebviewView;
  private _extensionPath!: string;
  private _event!: WebviewEvent;

  setExtensionPath(extensionPath: string) {
    this._extensionPath = extensionPath;
  }

  resolveWebviewView(webviewView: vscode.WebviewView): void | Thenable<void> {
    this._webviewView = webviewView;
    this.webview.options = {
      enableScripts: true
    };

    useWebviewEvent(this.webview, this._extensionPath).then((e) => {
      this._event = e;
      this.webview.html = getWebViewContent(path.join('template-dist', 'index.html'), this._extensionPath, this.webview);
    });
  }

  get webviewView() {
    return this._webviewView;
  }

  get webview() {
    return this.webviewView.webview;
  }

  async navigateTo(routePath = '') {
    if (!this.webviewView) {
      const result = await vscode.window.showWarningMessage('阅读侧栏没有激活, 请先点击阅读侧栏 [ANY-READER:VIEW]', { title: '查看文档' });
      console.log(result);
      if (result?.title === '查看文档') {
        const doc = 'https://aooiuu.github.io/any-reader/vsc/#侧边栏阅读问题';
        vscode.commands.executeCommand('vscode.open', doc);
      }
      return;
    }
    this.webviewView.show(true); // 聚焦
    this._event.pm.emit('router.push', routePath, this.webview);
  }
}

export const webviewProvider = new WebviewProvider();
