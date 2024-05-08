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
  readonly cache = new Map();

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

  // 获取缓存列表
  getChildrenCache(ruleId: string, url: string) {
    const key = `${ruleId}@${url}`;
    return this.cache.get(key) || this.cache.get('_') || [];
  }

  async getChildren(element?: TreeNode): Promise<TreeNode[]> {
    if (!element) {
      const items = await bookManager.getChildren();
      return items;
    } else {
      const chapters = await bookManager.getChapter(element);
      this.cache.set(`${element.rule.id}@${element.url}`, chapters);
      return chapters;
    }
  }

  setChapters(chapterItems: ChapterItem[], rule: Rule, url: string) {
    this.cache.clear();
    bookManager.list = chapterItems.map((chapterItem: ChapterItem) => ({
      rule,
      type: 2,
      data: chapterItem,
      url
    }));
    this.cache.set('_', bookManager.list);
    this.refresh();
  }
}

export default new BookProvider();
