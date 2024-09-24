import * as vscode from 'vscode';
import { stringify } from 'qs';
import { COMMANDS } from './constants';
import { webviewProvider } from './sidebar/webviewProvider';
import { WebView } from './webview';
import { CustomEditorProvider } from './editorProvider/CustomEditorProvider';

class App {
  private webView!: WebView;

  async activate(context: vscode.ExtensionContext) {
    this.webView = new WebView(context);

    // 注册命令
    const registerCommand = vscode.commands.registerCommand;
    [
      registerCommand(COMMANDS.searchBook, this.searchBook, this),
      registerCommand(COMMANDS.getChapter, this.getChapter, this),
      registerCommand(COMMANDS.discover, this.discover, this),
      registerCommand(COMMANDS.openUrl, this.openUrl, this),
      registerCommand(COMMANDS.openFile, this.openFile, this),
      registerCommand(COMMANDS.home, () => this.webView.navigateTo('/rules'), this.webView)
    ].forEach((command) => context.subscriptions.push(command));

    // 侧边栏 - webview
    webviewProvider.setExtensionPath(context.extensionPath);
    vscode.window.registerCustomEditorProvider('any-reader.customEditor.epub', new CustomEditorProvider(context));
    vscode.window.registerWebviewViewProvider('any-reader-webview', webviewProvider);
  }

  // 搜索
  async searchBook() {
    this.webView.navigateTo('/search');
  }

  // 发现页
  discover() {
    this.webView.navigateTo('/category');
  }

  // 打开链接
  openUrl(url: string) {
    this.webView.navigateTo(url);
  }

  // 打开文件
  openFile(fileEvent: { fsPath: string }) {
    this.webView.navigateTo(
      '/chapter?' +
        stringify({
          filePath: fileEvent.fsPath
        })
    );
  }

  /**
   * 获取章节
   */
  async getChapter(params: any) {
    const { ruleId, data } = params;

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
              ruleId,
              ...data,
              filePath: data.url
            })
        );
      }
    );
  }
}

export const app = new App();
