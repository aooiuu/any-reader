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

  get pm() {
    return this._pm;
  }

  constructor(webview: vscode.Webview, extensionPath: string) {
    this._pm = new EasyPostMessage(createAdapter(webview));
    this._pm.answer('post@vscode/executeCommand', this.executeCommand.bind(this));
    const logLevelConfig = vscode.workspace.getConfiguration('any-reader').get('logLevel') as keyof typeof LogLevel;
    const logLevel = logLevelConfig ? (LogLevel[logLevelConfig] ?? LogLevel.Off) : LogLevel.Off;
    const logger = new Logger();
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
            const filePath = path.join(extensionPath, 'dist', file);
            logger.log(`[locateFile] ${filePath}`);
            return filePath;
          }
        }
      }
    });

    app.useApi(this._pm.answer.bind(this._pm));
  }

  private executeCommand({ command, data }: any) {
    const args = Array.isArray(data) ? data : typeof data === 'object' ? [data] : [];
    vscode.commands.executeCommand(command, ...args);
  }
}

export function useWebviewEvent(webView: vscode.Webview, extensionPath: string) {
  return new WebviewEvent(webView, extensionPath);
}
