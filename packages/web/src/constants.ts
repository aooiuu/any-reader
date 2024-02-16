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
  { value: 0, label: 'MANGA' },
  { value: 1, label: 'NOVEL' },
  { value: 2, label: 'VIDEO' },
  // { value: 3, label: 'AUDIO' },
  // { value: 4, label: 'RSS' },
  // { value: 5, label: 'NOVELMORE' },

  { value: 101, label: 'GAME' }
];
