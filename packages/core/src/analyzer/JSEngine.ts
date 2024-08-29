import vm from 'node:vm';
import CryptoJS from 'crypto-js';
import * as cheerio from 'cheerio';
import type { Rule } from '@any-reader/rule-utils';
import { AnalyzerXPath } from '../analyzer/AnalyzerXPath';
import { JsVmException } from '../exception/JsVmException';
import { __http__ } from './request';

export class JSEngine {
  static environment: any = {};

  static setEnvironment(env: Record<string, any>) {
    Object.assign(JSEngine.environment || {}, env);
  }

  static async evaluate(command: string, context: any = {}) {
    const { rule } = JSEngine.environment;
    if (rule?.loadJs) command = `${rule.loadJs};${command}`;
    const http = function (url: string) {
      return __http__(url, JSEngine.environment.rule as Rule);
    };
    http.get = (url: string) => http(url);

    try {
      const p = vm.runInNewContext(
        command,
        vm.createContext({
          cheerio,
          CryptoJS,
          fetch,

          // 暂时不考虑使用了 `window` 方法的规则, 理论上规则不应该使用 `window` 变量
          window: {},

          ...JSEngine.environment,
          ...context,

          // 处理 eso 规则中的注入JS
          __http__: (url: string) => {
            return __http__(url, JSEngine.environment.rule as Rule);
          },
          http,
          xpath: async (html: string, xpath: string): Promise<string[]> => {
            const analyzer = new AnalyzerXPath();
            analyzer.parse(html);
            return await analyzer.getStringList(xpath);
          }
        })
      );
      return typeof p === 'object' && typeof p.then === 'function' ? await p : p;
    } catch (error) {
      throw new JsVmException(String(error));
    }
  }
}
