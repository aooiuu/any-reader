import CryptoJS from 'crypto-js';
import * as cheerio from 'cheerio';
import type { Rule } from '@any-reader/rule-utils';
import { xpath } from './xpath';
import { __http__ } from '../analyzer/request';

// 处理 eso 规则中的注入JS
export function injectJs(rule: Rule) {
  const http = function (url: string) {
    return __http__(url, rule);
  };
  http.get = (url: string) => http(url);

  return {
    cheerio,
    CryptoJS,
    fetch: fetch.bind(globalThis), // Failed to execute 'fetch' on 'Window'

    __http__: (url: string) => {
      return __http__(url, rule);
    },
    http,
    xpath
  };
}
