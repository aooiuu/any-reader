import type { Rule } from '@any-reader/rule-utils';
import { fetch } from './request';
import { JSEngine } from './JSEngine';

async function parseUrl(url: string) {
  if (url.startsWith('@js:')) url = await JSEngine.evaluate(url.substring(4));
  return url;
}

export async function analyzerUrl(url: string, keyword = '', result = '', rule: Rule) {
  return await fetch(await parseUrl(url), keyword, result, rule);
}
