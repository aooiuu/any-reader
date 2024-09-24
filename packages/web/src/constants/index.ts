import { version } from '../../package.json';

export type TPlatform = 'browser' | 'vscode' | 'electron' | 'utools';

export const PLATFORM: TPlatform = import.meta.env.VITE_APP_PLATFORM;

export const CONTENT_TYPES = [
  { value: 0, label: '漫画', platform: ['browser', 'electron', 'vscode', 'utools'] },
  { value: 1, label: '小说', platform: ['browser', 'electron', 'vscode', 'utools'] },
  { value: 2, label: '视频', platform: ['browser', 'electron', 'vscode', 'utools'] },
  { value: 3, label: '音频', platform: ['browser', 'electron', 'utools'] },
  // { value: 4, label: 'RSS' },
  // { value: 5, label: 'NOVELMORE' },

  { value: 101, label: '游戏', platform: ['vscode'] }
].filter((e) => e.platform.includes(PLATFORM));

export const BASE_URL = import.meta.env.VITE_APP_BASE_URL || '/api';

export const VERSION = version;

export const IS_MOBILE = /mobi/i.test(navigator.userAgent.toLowerCase());

export const IS_VSCODE = PLATFORM === 'vscode';
