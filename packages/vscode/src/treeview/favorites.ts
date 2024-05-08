/**
 * 侧边栏 - 收藏
 */

import * as vscode from 'vscode';
import { COMMANDS } from '../constants';
import { RecordFileRow } from '../utils/RecordFile';
import dataManager from '../utils/favoritesManager';

class TreeDataProvider implements vscode.TreeDataProvider<RecordFileRow> {
  readonly _onDidChangeTreeData = new vscode.EventEmitter<RecordFileRow | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  async refresh(): Promise<void> {
    await dataManager.init();
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(treeNode: RecordFileRow): vscode.TreeItem {
    return {
      label: treeNode.name,
      tooltip: treeNode.name,
      collapsibleState: vscode.TreeItemCollapsibleState.None,
      command: {
        command: COMMANDS.getChapter,
        title: 'open',
        arguments: [treeNode]
      }
    };
  }

  getChildren(element?: RecordFileRow): Promise<RecordFileRow[]> {
    if (!element) {
      return dataManager.list();
    } else {
      return Promise.resolve([]);
    }
  }
}

export default new TreeDataProvider();
