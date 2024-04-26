import * as os from 'os';
import * as path from 'path';

export enum COMMANDS {
  editBookSource = 'any-reader.editBookSource',
  searchBook = 'any-reader.searchBook',
  searchBookByRule = 'any-reader.searchBookByRule',
  getChapter = 'any-reader.getChapter',
  getContent = 'any-reader.getContent',
  discover = 'any-reader.discover',
  star = 'any-reader.star',
  unstar = 'any-reader.unstar',
  historyRefresh = 'any-reader.historyRefresh',
  favoritesRefresh = 'any-reader.favoritesRefresh',
  // 本地书籍
  getContentLocalBook = 'any-reader.getContentLocalBook',
  openLocalBookDir = 'any-reader.openLocalBookDir',
  refreshLocalBooks = 'any-reader.refreshLocalBooks',
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
// 收藏配置路径
export const FAVORITES_PATH = path.join(ROOT_PATH, 'favorites.json');
