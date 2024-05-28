import * as vscode from 'vscode';
import { ruleFileManager } from '@any-reader/shared';
import { RuleManager, Rule, SearchItem, ChapterItem } from '@any-reader/core';

export interface TreeNode {
  rule: Rule;
  type: number; // 1=SearchItem 2=ChapterItem
  data: SearchItem | ChapterItem;
  url: string;
}

class BookManager implements vscode.Disposable {
  public list: TreeNode[] = [];

  dispose(): void {
    this.list = [];
  }

  async searchBook(rule?: Rule) {
    const keyword = await vscode.window.showInputBox({
      prompt: '书源搜索',
      value: ''
    });
    if (!keyword) {
      return;
    }

    if (!rule) {
      const bs = await ruleFileManager.list();
      if (bs.length === 0) {
        return;
      }

      rule = bs[0];
    }

    const rm = new RuleManager(rule);
    const list = await rm.search(keyword);
    this.list = list.map((searchItem: SearchItem) => {
      return {
        rule,
        type: 1,
        data: searchItem,
        url: searchItem.url
      } as TreeNode;
    });
  }

  getChildren(): Promise<TreeNode[]> {
    return Promise.resolve(this.list);
  }

  async getChapter(tn: TreeNode): Promise<TreeNode[]> {
    const rm = new RuleManager(tn.rule);
    const list = await rm.getChapter(tn.data.url);
    return Promise.resolve(
      list.map((e: any) => ({
        type: 2,
        rule: tn.rule,
        url: tn.data.url,
        data: e
      }))
    );
  }

  async getContent(tn: TreeNode): Promise<string[]> {
    const rm = new RuleManager(tn.rule);
    return await rm.getContent(tn.data.url);
  }
}

export default new BookManager();
