import * as os from 'os';
import * as path from 'path';

export enum COMMANDS {
  editBookSource = 'any-reader.editBookSource',
  searchBook = 'any-reader.searchBook',
  searchBookByRule = 'any-reader.searchBookByRule',
  getChapter = 'any-reader.getChapter',
  getContent = 'any-reader.getContent',
  discover = 'any-reader.discover',

  // 读取所有书源
  getBookSource = 'any-reader.getBookSource',
  home = 'any-reader.home',
  gamePlay = 'any-reader.gamePlay'
}

export const ROOT_PATH = path.join(os.homedir(), '.any-reader');

// 规则路径
export const BOOK_SOURCE_PATH = path.join(ROOT_PATH, 'book-source.json');
// 历史记录路径
export const HISTORY_PATH = path.join(ROOT_PATH, 'history.json');
