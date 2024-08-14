import * as path from 'path';
import * as vscode from 'vscode';
import { getWebViewContent } from '../utils/webview';
import { useWebviewEvent, WebviewEvent } from '../webview/WebviewEvent';

export class WebviewProvider implements vscode.WebviewViewProvider {
  private _webviewView!: vscode.WebviewView;
  private _extensionPath!: string;
  private _event!: WebviewEvent;
  private route?: string;

  setExtensionPath(extensionPath: string) {
    this._extensionPath = extensionPath;
  }

  resolveWebviewView(webviewView: vscode.WebviewView): void | Thenable<void> {
    this._webviewView = webviewView;
    this.webview.options = {
      enableScripts: true
    };

    this.webview.html = getWebViewContent(path.join('template-dist', 'index.html'), this._extensionPath, this.webview);
    this._event = useWebviewEvent(this.webview, this._extensionPath);

    // 保存上下文
    this._event.pm.answer('post@vscode/saveRoute', async (data) => {
      this.route = data.fullPath;
      return true;
    });

    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible && this.route) {
        const injectScript = `window.__vscode$initialize_page = '${this.route}';`;
        this.webview.html = getWebViewContent(path.join('template-dist', 'index.html'), this._extensionPath, this.webview, injectScript);
      }
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
