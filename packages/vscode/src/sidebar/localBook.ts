import * as vscode from 'vscode';
import { TreeNode, BookFile, BookChapter } from '@any-reader/shared/localBookManager';
import localBookManager from '@any-reader/shared/localBookManager';
import { COMMANDS } from '../constants';

class TreeDataProvider implements vscode.TreeDataProvider<TreeNode> {
  readonly _onDidChangeTreeData = new vscode.EventEmitter<TreeNode | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  async refresh(): Promise<void> {
    this._onDidChangeTreeData.fire(undefined);
  }

  // 节点展示
  getTreeItem(item: TreeNode): vscode.TreeItem {
    if ((<BookChapter>item).chapterPath) {
      return this.getTreeItemBookChapter(item as BookChapter);
    } else {
      return this.getTreeItemBookFile(item as BookFile);
    }
  }

  // 文件展示
  getTreeItemBookFile(item: BookFile) {
    return {
      label: item.name,
      tooltip: item.name,
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed
    };
  }

  // 章节展示
  getTreeItemBookChapter(item: BookChapter) {
    return {
      label: item.name,
      tooltip: item.name,
      collapsibleState: vscode.TreeItemCollapsibleState.None,
      command: {
        command: COMMANDS.getContentLocalBook,
        title: 'open',
        arguments: [item]
      }
    };
  }

  // 获取目录
  async getChildren(item?: BookFile): Promise<TreeNode[]> {
    if (!item) {
      return localBookManager.getBookList();
    } else {
      const chapters = await localBookManager.getChapter(item.path).catch(() => []);
      return chapters;
    }
  }
}

export default new TreeDataProvider();
