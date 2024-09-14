import { resolve } from 'path';

function r(p: string) {
  return resolve(__dirname, p);
}

export const alias: Record<string, string> = {
  '@any-reader/core': r('./packages/core/src'),
  '@any-reader/shared': r('./packages/shared/src'),
  '@any-reader/rule-utils': r('./packages/rule-utils/src'),
  '@any-reader/epub': r('./packages/epub/src')
};
