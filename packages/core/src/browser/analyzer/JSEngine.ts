import CryptoJS from 'crypto-js';
import * as cheerio from 'cheerio';
import type { Rule } from '@any-reader/rule-utils';
import { AnalyzerXPath } from '../analyzer';
import { __http__ } from '../../analyzer/request';
import { JSEngine as BaseJSEngine } from '../../sandbox/JSEngine';

export class JSEngine extends BaseJSEngine {
  static environment: any = {};
  static VMCtx: any;

  static setEnvironment(env: Record<string, any>) {
    Object.assign(JSEngine.environment, env);
  }

  static init() {
    const http = function (url: string) {
      return __http__(url, JSEngine.environment.rule as Rule);
    };
    http.get = (url: string) => http(url);

    JSEngine.VMCtx = Object.create(null);

    Object.assign(JSEngine.VMCtx, {
      cheerio,
      CryptoJS,
      fetch: fetch.bind(globalThis), // Failed to execute 'fetch' on 'Window'

      // 处理 eso 规则中的注入JS
      __http__: (url: string) => {
        return __http__(url, JSEngine.environment.rule as Rule);
      },
      http,
      xpath: async (html: string, xpath: string): Promise<string[]> => {
        const analyzer = new AnalyzerXPath({
          JSEngine: null as unknown as typeof JSEngine
        });
        analyzer.parse(html);
        return await analyzer.getStringList(xpath);
      }
    });
  }

  static async evaluate(command: string, context: any = {}) {
    if (!JSEngine.VMCtx) JSEngine.init();
    const { rule } = JSEngine.environment;
    let scripts = '';
    if (rule?.loadJs) scripts += rule.loadJs + ';';
    scripts += command + ';';
    Object.assign(JSEngine.VMCtx, JSEngine.environment, context);
    (0, eval)('window').proxy = JSEngine.VMCtx;
    // 处理作用域
    const code = `(function(window, self, globalThis){with(window){;return ${scripts}}}).bind(window.proxy)(window.proxy, window.proxy, window.proxy);`;
    return (0, eval)(`(function(){return ${code}})`).call(globalThis);
  }
}
