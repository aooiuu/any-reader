import * as os from 'node:os';
import * as path from 'node:path';
import * as fs from 'fs-extra';

export const ROOT_PATH = path.join(os.homedir(), '.any-reader');
export const CONFIG_PATH = path.join(ROOT_PATH, 'config.desktop.json');

fs.ensureFileSync(CONFIG_PATH);

let config = {} as Setting;

try {
  config = fs.readJSONSync(CONFIG_PATH);
} catch (error) {
  console.warn('[readJSONSync]', error);
}

fs.watchFile(CONFIG_PATH, () => {
  config = fs.readJSONSync(CONFIG_PATH);
});

export function getConfig(): Setting {
  return config;
}

export type ReadStyle = {
  // 字体大小
  fontSize: Number;
  // 行高
  lineHeight: Number;
  // 文字间距
  letterSpacing: Number;
  // 文字颜色
  textColor: string;
  // 背景颜色
  backgroundColor: string;
};

// 快捷键
export type KeyboardShortcuts = {
  prevChapter: string;
  nextChapter: string;
  pageUp: string;
  pageDown: string;
};

// 侧边栏
export type Sidebar = 'left' | 'right' | 'hidden' | '';

export type Setting = {
  readStyle: ReadStyle;
  keyboardShortcuts: KeyboardShortcuts;
  sidebar: Sidebar;
  pinned: boolean;
  bookDir: string;
};
