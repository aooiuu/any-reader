import * as os from 'os';
import * as path from 'path';

export enum COMMANDS {
  searchBook = 'any-reader.search',
  getChapter = 'any-reader.getChapter',
  discover = 'any-reader.discover',
  openLocalBookDir = 'any-reader.openLocalBookDir',
  home = 'any-reader.home',
  openUrl = 'any-reader.openUrl',
  openFile = 'any-reader.openFile'
}

export const ROOT_PATH = path.join(os.homedir(), '.any-reader');
export const CONFIG_PATH = path.join(ROOT_PATH, 'config.vscode.json');
