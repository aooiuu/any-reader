/**
 * 侧边栏 - 阅读
 */

import * as vscode from 'vscode';
import { COMMANDS } from '../constants';
import bookManager, { TreeNode } from './bookManager';
import favoritesManager from '../utils/favoritesManager';
import { ChapterItem, Rule } from '@any-reader/core';

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

  async getChildren(element?: TreeNode): Promise<TreeNode[]> {
    if (!element) {
      const items = await bookManager.getChildren();
      return items;
    } else {
      const chapters = await bookManager.getChapter(element);
      return chapters;
    }
  }

  setChapters(chapterItems: ChapterItem[], rule: Rule, url: string) {
    bookManager.list = chapterItems.map((chapterItem: ChapterItem) => ({
      rule,
      type: 2,
      data: chapterItem,
      url
    }));
    this.refresh();
  }
}

export default new BookProvider();
