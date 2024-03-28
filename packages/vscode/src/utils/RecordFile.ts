import * as fs from 'fs-extra';
import { Rule, SearchItem } from '@any-reader/core';

export interface RecordFileRow extends SearchItem {
  ruleId: string;
  createTime: number;
}

let history: RecordFileRow[] = [];

const MAX_LENGTH = 100;

export class RecordFile {
  filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  // 初始化
  async init() {
    await fs.ensureFile(this.filePath);
    history = await fs.readJson(this.filePath);
  }

  // 获取所有记录
  async list() {
    return history;
  }

  // 保存配置文件
  async writeFile() {
    await fs.ensureFile(this.filePath);
    return fs.writeJson(this.filePath, history, { spaces: 2 });
  }

  // 删除记录
  async del(item: SearchItem, rule: Rule, saveFile = true) {
    history = history.filter((e) => e.ruleId !== rule.id || e.url !== item.url);
    if (saveFile) {
      await this.writeFile();
    }
  }

  // 添加记录
  async add(item: SearchItem, rule: Rule) {
    if (history.length > MAX_LENGTH) {
      history.splice(MAX_LENGTH);
    }
    this.del(item, rule, false);
    history.unshift({
      ...item,
      ruleId: rule.id,
      createTime: Date.now()
    });
    await this.writeFile();
  }
}
