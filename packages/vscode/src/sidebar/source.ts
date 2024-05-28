/**
 * 侧边栏 - 规则
 */

import * as vscode from 'vscode';
import { Rule, ContentType } from '@any-reader/core';
import { ruleFileManager } from '@any-reader/shared';

export class SourceProvider implements vscode.TreeDataProvider<Rule> {
  readonly _onDidChangeTreeData = new vscode.EventEmitter<Rule | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  async refresh(): Promise<void> {
    await ruleFileManager.init();
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(el: Rule): vscode.TreeItem {
    return {
      label: el.name,
      tooltip: el.name,
      contextValue: el.contentType === ContentType.GAME ? 'GAME' : '',
      resourceUri: vscode.Uri.from({
        scheme: 'any-reader',
        authority: 'any-reader',
        path: `/${el.id}`,
        query: `contentType=${el.contentType}`
      })
    };
  }

  async getChildren(element?: Rule): Promise<Rule[]> {
    if (!element) {
      const rules = await ruleFileManager.list();
      return rules.filter(
        (e: Rule) =>
          (e.enableSearch || e.contentType === ContentType.GAME) &&
          [ContentType.GAME, ContentType.MANGA, ContentType.NOVEL, ContentType.VIDEO].includes(e.contentType)
      );
    }
    return [];
  }
}

export default new SourceProvider();
