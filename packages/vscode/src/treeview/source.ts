import * as vscode from 'vscode';
import { Rule } from '@any-reader/core';
import sourceManager from './sourceManager';

export class SourceProvider implements vscode.TreeDataProvider<Rule> {
  readonly _onDidChangeTreeData = new vscode.EventEmitter<Rule | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(el: Rule): vscode.TreeItem {
    return {
      label: el.name,
      tooltip: el.name
    };
  }

  async getChildren(element?: Rule): Promise<Rule[]> {
    if (!element) {
      return sourceManager.getChildren();
    }
    return [];
  }
}
