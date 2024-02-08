import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import { Rule, decodeRule } from '@any-reader/core';

export const ROOT_PATH = path.join(os.homedir(), '.any-reader');
export const BOOK_SOURCE_PATH = path.join(ROOT_PATH, 'book-source.json');

export async function ensureFile() {
  await fs.ensureFile(BOOK_SOURCE_PATH);
}

export async function getBookSource(): Promise<Rule[]> {
  try {
    const list = await fs.readJson(BOOK_SOURCE_PATH);
    for (let i = 0; i < list.length; i++) {
      const rule = list[i];
      if (typeof rule === 'string' && rule.includes('eso://')) {
        list[i] = decodeRule(rule);
      }
    }
    setBookSource(list);
    return list;
  } catch (e) {
    console.log(e);

    return [];
  }
}

export async function setBookSource(bookSource: Rule[]) {
  await fs.ensureFile(BOOK_SOURCE_PATH);
  await fs.writeJson(BOOK_SOURCE_PATH, bookSource, { spaces: 2 });
}
