import * as vscode from 'vscode';
import { COMMANDS } from '../constants';
import bookManager, { TreeNode } from './bookManager';
import favoritesManager from '../utils/favoritesManager';

export class BookProvider implements vscode.TreeDataProvider<TreeNode> {
  readonly _onDidChangeTreeData = new vscode.EventEmitter<TreeNode | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(treeNode: TreeNode): vscode.TreeItem {
    return {
      label: treeNode.data.name,
      tooltip: treeNode.rule.name,
      collapsibleState: treeNode.type === 1 ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
      contextValue: treeNode.type === 1 ? (favoritesManager.has(treeNode.rule, treeNode.data.url) ? 'unstar' : 'star') : undefined,
      command:
        treeNode.type === 1
          ? undefined
          : {
              command: COMMANDS.getContent,
              title: 'open',
              arguments: [treeNode]
            }
    };
  }

  getChildren(element?: TreeNode): Promise<TreeNode[]> {
    if (!element) {
      return bookManager.getChildren();
    } else {
      return bookManager.getChapter(element);
    }
  }
}

export default new BookProvider();
