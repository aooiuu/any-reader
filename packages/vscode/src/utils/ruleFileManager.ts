import * as fs from 'fs-extra';
import { v4 as uuidV4 } from 'uuid';
import { BOOK_SOURCE_PATH } from '../constants';
import { Rule, decodeRule } from '@any-reader/core';

let ruleList: Rule[] = [];

async function readRuleList(): Promise<Rule[]> {
  try {
    const list = await fs.readJson(BOOK_SOURCE_PATH);
    for (let i = 0; i < list.length; i++) {
      const rule = list[i];
      if (typeof rule === 'string' && rule.includes('eso://')) {
        list[i] = decodeRule(rule);
      }
    }
    return list;
  } catch (e) {
    console.log(e);

    return [];
  }
}

// 初始化
export async function init() {
  await fs.ensureFile(BOOK_SOURCE_PATH);
  ruleList = await readRuleList();
}

// 保存配置文件
async function writeFile() {
  await fs.ensureFile(BOOK_SOURCE_PATH);
  return fs.writeJson(BOOK_SOURCE_PATH, ruleList, { spaces: 2 });
}

export function list(): Rule[] {
  return ruleList;
}

// 删除记录
export async function del(id: string, saveFile = true) {
  ruleList = ruleList.filter((e) => e.id !== id);
  if (saveFile) {
    await writeFile();
  }
}

// 更新记录
export async function update(rule: Rule) {
  if (!rule.id) {
    rule.id = uuidV4();
  }
  const findIdx = ruleList.findIndex((e) => e.id === rule.id);
  if (findIdx === -1) {
    ruleList.push(rule);
  } else {
    ruleList[findIdx] = rule;
  }
  await writeFile();
}

export async function fundById(id: string): Promise<Rule> {
  const list: Rule[] = await fs.readJson(BOOK_SOURCE_PATH);
  return list.find((e) => e.id === id) as Rule;
}
