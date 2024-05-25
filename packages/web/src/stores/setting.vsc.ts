import { merge } from 'lodash-es';
import { readConfig, updateConfig } from '@/api';

export type ReadStyle = {
  // 字体大小
  fontSize: Number;
  // 行高
  lineHeight: Number;
  // 文字间距
  letterSpacing: Number;
};

// 快捷键
export type KeyboardShortcuts = {
  prevChapter: string;
  nextChapter: string;
  pageUp: string;
  pageDown: string;
};

export type Setting = {
  readStyle: ReadStyle;
  keyboardShortcuts: KeyboardShortcuts;
  bookDir: string;
};

export const useSettingStore = defineStore('setting', () => {
  const data = reactive<Setting>({
    readStyle: {
      fontSize: 16,
      lineHeight: 1.5,
      letterSpacing: 1
    },
    keyboardShortcuts: {
      prevChapter: '←',
      nextChapter: '→',
      pageUp: '↑',
      pageDown: '↓'
    },
    bookDir: ''
  });

  // 同步
  async function sync() {
    const res = await readConfig().catch(() => {});
    if (res?.code === 0) {
      merge(data, res.data || {});
    }
  }

  watch(data, (v) => {
    updateConfig(toRaw(v));
  });

  sync();

  return {
    data,
    sync
  };
});
