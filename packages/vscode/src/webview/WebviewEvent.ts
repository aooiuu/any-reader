/**
 * webview 消息处理
 */

import * as path from 'node:path';
import * as vscode from 'vscode';
import EasyPostMessage from 'easy-post-message';
import { createAnalyzerManager, LogLevel } from '@any-reader/core';
import { createApp } from '@any-reader/shared';
import { createAdapter } from '../utils/easyPostMessage';
import { CONFIG_PATH } from '../constants';
import { Logger } from '../Logger';

export class WebviewEvent {
  private _pm!: EasyPostMessage;
  private _extensionPath: string;
  private _logger = new Logger();

  get pm() {
    return this._pm;
  }

  constructor(webview: vscode.Webview, extensionPath: string) {
    this._pm = new EasyPostMessage(createAdapter(webview));
    this._pm.answer('post@vscode/executeCommand', this.executeCommand.bind(this));
    this._pm.answer('post@vscode/log', this.webviewLog.bind(this));
    this._extensionPath = extensionPath;
  }

  async useApi() {
    const logLevelConfig = vscode.workspace.getConfiguration('any-reader').get('logLevel') as keyof typeof LogLevel;
    const logLevel = logLevelConfig ? (LogLevel[logLevelConfig] ?? LogLevel.Off) : LogLevel.Off;
    const logger = new Logger(logLevel);
    this._logger = logger;
    logger.info(`[logLevel] ${logLevel}`);

    const app = createApp({
      configPath: CONFIG_PATH,
      analyzerManager: createAnalyzerManager({
        logLevel,
        logger
      }),
      dataSourceOptions: {
        driver: require('sql.js/dist/sql-wasm'),
        sqlJsConfig: {
          locateFile: (file: string) => {
            const filePath = path.join(this._extensionPath, 'dist', file);
            logger.log(`[locateFile] ${filePath}`);
            return filePath;
          }
        }
      }
    });

    await app.useApi(this._pm.answer.bind(this._pm));
    return this;
  }

  private executeCommand({ command, data }: any) {
    const args = Array.isArray(data) ? data : typeof data === 'object' ? [data] : [];
    vscode.commands.executeCommand(command, ...args);
  }

  private webviewLog({ level = 'Debug', scope = 'webview', message = '', data }: any) {
    this._logger.write(level, `[${scope}] ${message}`, data);
  }
}

export function useWebviewEvent(webView: vscode.Webview, extensionPath: string) {
  return new WebviewEvent(webView, extensionPath).useApi();
}
