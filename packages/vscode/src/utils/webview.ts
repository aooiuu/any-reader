import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';

/**
 * 获取 html 模板
 * @param {string} templatePath 模板路径
 * @param {string} extensionPath 扩展路径
 * @param {vscode.Webview} webview
 * @returns {string} 模板HTML
 */
export function getWebViewContent(templatePath: string, extensionPath: string, webview: vscode.Webview): string {
  const resourcePath = path.join(extensionPath, templatePath);
  const dirPath = path.dirname(resourcePath);
  const html = fs.readFileSync(resourcePath, 'utf-8').replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(\.\/.+?)"/g, (_, $1, $2) => {
    return $1 + webview.asWebviewUri(vscode.Uri.file(path.resolve(dirPath, $2))) + '"';
  });
  return html;
}
