import type { Rule } from '@any-reader/rule-utils';
import { fetch } from './request';
import { JSEngine } from './JSEngine';

function parseUrl(url: string) {
  if (url.startsWith('@js:')) url = JSEngine.evaluate(url.substring(4));
  return url;
}

export function analyzerUrl(url: string, keyword = '', result = '', rule: Rule) {
  return fetch(parseUrl(url), keyword, result, rule);
}
