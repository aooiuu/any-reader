import * as vscode from 'vscode';

const outputChannel = vscode.window.createOutputChannel('any-reader');

function formatMsg(message: string, type: string) {
  return `${new Date().toLocaleString()} [${type}] ${message}`;
}

export class Logger {
  log(message: string): void {
    typeof message === 'string' && outputChannel.appendLine(formatMsg(message, 'log'));
  }
  trace(message: any): void {
    typeof message === 'string' && outputChannel.appendLine(formatMsg(message, 'trace'));
  }
  debug(message: any): void {
    typeof message === 'string' && outputChannel.appendLine(formatMsg(message, 'debug'));
  }
  info(message: any): void {
    typeof message === 'string' && outputChannel.appendLine(formatMsg(message, 'info'));
  }
  warn(message: any): void {
    typeof message === 'string' && outputChannel.appendLine(formatMsg(message, 'warn'));
  }
  error(message: any): void {
    typeof message === 'string' && outputChannel.appendLine(formatMsg(message, 'error'));
  }
}
