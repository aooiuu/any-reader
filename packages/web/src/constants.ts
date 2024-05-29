export enum CONTENT_TYPE {
  MANGA = 0,
  NOVEL = 1,
  VIDEO = 2,
  AUDIO = 3,
  RSS = 4,
  NOVELMORE = 5,
  GAME = 101
}

export const CONTENT_TYPES = [
  { value: 0, label: '漫画' },
  { value: 1, label: '小说' },
  { value: 2, label: '视频' },
  // { value: 3, label: 'AUDIO' },
  // { value: 4, label: 'RSS' },
  // { value: 5, label: 'NOVELMORE' },

  { value: 101, label: '游戏' }
];

export const PLATFORM: 'browser' | 'vscode' | 'electron' = import.meta.env.VITE_APP_PLATFORM;

export const BASE_URL = '/api';
