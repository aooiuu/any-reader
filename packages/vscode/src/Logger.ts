import * as vscode from 'vscode';
import { LogLevel } from '@any-reader/core';

const outputChannel = vscode.window.createOutputChannel('any-reader');

function formatMsg(message: string, type: string) {
  return `${new Date().toLocaleString()} [${type}] ${message}`;
}

export class Logger {
  private logLevel: LogLevel;

  constructor(logLevel = LogLevel.Off) {
    this.logLevel = logLevel;
  }

  setLevel(logLevel: LogLevel) {
    this.logLevel = logLevel;
  }

  private shouldLog(level: LogLevel) {
    return this.logLevel >= level;
  }

  private stringify(message: any, data?: any) {
    const text = typeof message === 'string' ? message : JSON.stringify(message);
    if (typeof data === 'undefined') return text;
    return `${text} ${typeof data === 'string' ? data : JSON.stringify(data)}`;
  }

  write(level: keyof typeof LogLevel | 'log', message: any, data?: any): void {
    const method = level === 'log' ? 'log' : level.toLowerCase();
    if (method === 'trace') this.trace(message, data);
    else if (method === 'debug') this.debug(message, data);
    else if (method === 'info') this.info(message, data);
    else if (method === 'warn') this.warn(message, data);
    else if (method === 'error' || method === 'fatal') this.error(message, data);
    else this.log(message, data);
  }

  log(message: any, data?: any): void {
    this.shouldLog(LogLevel.Info) && outputChannel.appendLine(formatMsg(this.stringify(message, data), 'log'));
  }
  trace(message: any, data?: any): void {
    this.shouldLog(LogLevel.Trace) && outputChannel.appendLine(formatMsg(this.stringify(message, data), 'trace'));
  }
  debug(message: any, data?: any): void {
    this.shouldLog(LogLevel.Debug) && outputChannel.appendLine(formatMsg(this.stringify(message, data), 'debug'));
  }
  info(message: any, data?: any): void {
    this.shouldLog(LogLevel.Info) && outputChannel.appendLine(formatMsg(this.stringify(message, data), 'info'));
  }
  warn(message: any, data?: any): void {
    this.shouldLog(LogLevel.Warn) && outputChannel.appendLine(formatMsg(this.stringify(message, data), 'warn'));
  }
  error(message: any, data?: any): void {
    this.shouldLog(LogLevel.Error) && outputChannel.appendLine(formatMsg(this.stringify(message, data), 'error'));
  }
}
