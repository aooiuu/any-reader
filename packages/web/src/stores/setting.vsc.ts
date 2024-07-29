import { merge } from 'lodash-es';
import { readConfig, updateConfig } from '@/api';

export type ReadStyle = {
  // 字体大小
  fontSize: number;
  // 字体粗细
  fontWeight: number;
  // 行高
  lineHeight: number;
  // 文字间距
  letterSpacing: number;
  // 段落间距
  sectionSpacing: number;
  // 文字颜色
  textColor: string;
  // 背景颜色
  backgroundColor: string;
  // 文字透明度
  textOpacity: 1;
};

// 快捷键
export type KeyboardShortcuts = {
  prevChapter: string;
  nextChapter: string;
  pageUp: string;
  pageDown: string;
  tts: string;
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
      letterSpacing: 1,
      fontWeight: 400,
      sectionSpacing: 12,
      textColor: '',
      backgroundColor: '',
      textOpacity: 1
    },
    keyboardShortcuts: {
      prevChapter: '←',
      nextChapter: '→',
      pageUp: '↑',
      pageDown: '↓',
      tts: ''
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
