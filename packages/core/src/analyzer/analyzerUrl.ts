import type { Rule } from '@any-reader/rule-utils';
import { fetch, parseRequest } from './request';
import { JSEngine } from './JSEngine';

async function parseJsUrl(url: string) {
  if (url.startsWith('@js:')) url = await JSEngine.evaluate(url.substring(4));
  return url;
}

export async function analyzerUrl(url: string, keyword = '', result = '', rule: Rule) {
  return await fetch(parseRequest(await parseJsUrl(url), keyword, result, rule));
}
