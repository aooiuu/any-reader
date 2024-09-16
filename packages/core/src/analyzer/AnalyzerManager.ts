import { AnalyzerException } from '../exception/AnalyzerException';
import { ILogger, LogLevel } from '../logger';
import type { Analyzer } from './Analyzer';
import { AnalyzerJS } from './AnalyzerJS';
import type { JSEngine } from '../sandbox/JSEngine';

const RULE_TYPE_PATTERN = /@js:|@hetu:|@web:|@webview:|@css:|@json:|@http:|@xpath:|@match:|@regex:|@regexp:|@filter:|@replace:|@encode:|@decode:|^/gi;

class SingleRule {
  analyzer: Analyzer;
  rule: string;
  replace: string;

  constructor(analyzer: Analyzer, rule: string, replace = '') {
    this.analyzer = analyzer;
    this.rule = rule;
    this.replace = replace;
  }
}

export interface Analyzers {
  // 匹配则使用此解析程序
  pattern: RegExp;
  // 清除字符串
  replace?: RegExp;
  // 解析程序
  Analyzer: typeof Analyzer;
}

export interface AnalyzerManagerOption {
  analyzers: Analyzers[];
  logger: ILogger;
  logLevel: LogLevel;
  JSEngine: typeof JSEngine;
}

export class AnalyzerManager {
  public analyzers: Analyzers[];
  public logger: ILogger;
  public logLevel: LogLevel;
  public JSEngine: typeof JSEngine;

  constructor(params: AnalyzerManagerOption) {
    this.analyzers = params.analyzers || [];
    this.logger = params.logger || console;
    this.logLevel = params.logLevel || LogLevel.Off;
    this.JSEngine = params.JSEngine;
  }

  getAnalyzer(rule: string) {
    for (const analyzer of this.analyzers) {
      if (analyzer.pattern.test(rule)) return analyzer;
    }
    return this.analyzers[0];
  }

  // 规则从后往前解析
  splitRuleReversed(rule: string) {
    const ruleMath = Array.from(rule.matchAll(RULE_TYPE_PATTERN)).reverse();
    const ruleList: SingleRule[] = [];
    let end = rule.length;
    for (const m of ruleMath) {
      const start = m.index as number;
      let r = rule.substring(start, end);
      end = start as number;
      const analyzer = this.getAnalyzer(r);
      r = r.replace(analyzer.replace || analyzer.pattern, '');
      const position = r.indexOf('##');
      if (position > -1) {
        ruleList.push(
          new SingleRule(
            new analyzer.Analyzer({
              JSEngine: this.JSEngine
            }),
            r.substring(0, position),
            r.substring(position + 2)
          )
        );
      } else {
        ruleList.push(
          new SingleRule(
            new analyzer.Analyzer({
              JSEngine: this.JSEngine
            }),
            r,
            ''
          )
        );
      }
    }
    return ruleList.reverse();
  }

  async _getElements(r: SingleRule, rule?: string) {
    if (!rule) rule = r.rule;

    if (r.analyzer instanceof AnalyzerJS) {
      try {
        return await r.analyzer.getElements(rule);
      } catch (error: any) {
        throw new AnalyzerException(error?.message);
      }
    }

    if (rule.includes('&&')) {
      const result = [];
      for (const rSimple in rule.split('&&')) {
        const temp: any = await this._getElements(r, rSimple);
        if (temp) result.push(temp);
      }
      return result;
    } else if (rule.includes('||')) {
      for (const rSimple in rule.split('||')) {
        const temp: any = await this._getElements(r, rSimple);
        if (temp) return temp;
      }
    }
    try {
      return await r.analyzer.getElements(rule);
    } catch (error: any) {
      throw new AnalyzerException(error?.message);
    }
  }

  public async getElements(rule: string, body: string): Promise<any[]> {
    let temp: string | string[] = body;

    for (const r of this.splitRuleReversed(rule)) {
      r.analyzer.parse(temp as string);
      temp = await this._getElements(r);
    }

    if (Array.isArray(temp)) return temp;
    else return [temp];
  }

  replaceSmart(replace: string) {
    function _replacement(pattern: string) {
      return (...match: string[]) => pattern.replace(/\$(\d+)/, (...m: string[]) => match[+m[1]]);
    }

    if (!replace) return (s: string) => s;

    const r = replace.split('##');
    const match = RegExp(r[0], 'g');
    if (r.length === 1) {
      return (s: string) => s.replaceAll(match, '');
    } else {
      const pattern = r[1];
      if (pattern.includes('$')) {
        if (r.length === 2) return (s: string) => s.replace(match, _replacement(pattern));
        else return (s: string) => s.replace(match, _replacement(pattern));
      } else {
        if (r.length === 2) return (s: string) => s.replaceAll(match, pattern);
        else return (s: string) => s.replace(match, pattern);
      }
    }
  }

  async _getString(r: SingleRule, rule?: string): Promise<string> {
    if (rule === undefined) {
      rule = r.rule;
    }

    if (r.analyzer instanceof AnalyzerJS) {
      const temp = await r.analyzer.getString(rule);
      if (temp === null) {
        return '';
      } else if (Array.isArray(temp)) {
        return temp
          .map((s) => typeof s !== 'undefined' && String(s).trim())
          .filter((s) => s)
          .join('  ');
      }
      return String(temp).trim();
    }

    let result = '';

    if (rule.includes('&&')) {
      const rs = [];
      for (const rSimple of rule.split('&&')) {
        const temp = await this._getString(r, rSimple);
        if (temp.length > 0) {
          rs.push(temp);
        }
      }
      return rs.join('  ');
    } else if (rule.includes('||')) {
      for (const rSimple of rule.split('||')) {
        const temp = await this._getString(r, rSimple);
        if (temp.length > 0) {
          return temp;
        }
      }
    } else {
      const temp = await r.analyzer.getString(rule);
      if (Array.isArray(temp)) {
        result = temp
          .map((s) => typeof s !== 'undefined' && String(s).trim())
          .filter((s) => s)
          .join('  ');
      } else if (temp !== null) {
        result = String(temp).trim();
      }
    }

    return result.length === 0 ? '' : this.replaceSmart(r.replace)(result);
  }

  public async getString(rule: string, body: string): Promise<string> {
    if (!rule) return '';
    const expressionPattern = /\{\{(.*?)\}\}/g;

    const pLeft = rule.lastIndexOf('{{');
    const pRight = rule.lastIndexOf('}}');
    if (pLeft > -1 && pLeft < pRight) {
      let position = 0;
      const rs: string[] = [];
      for (const match of rule.matchAll(expressionPattern)) {
        rs.push(rule.substring(position, match.index));
        position = (match.index as number) + match[0].length;
        rs.push(await this.getString(match[1], body));
      }

      if (position < rule.length) rs.push(rule.substring(position));

      return rs.join('');
    }

    let temp: string = body;
    for (const r of this.splitRuleReversed(rule)) {
      r.analyzer.parse(temp as string);
      temp = await this._getString(r);

      if (r.replace) temp = this.replaceSmart(r.replace)(temp);
    }
    return temp;
  }

  async _getStringList(r: SingleRule, rule?: string): Promise<string[] | string> {
    if (rule === undefined) {
      rule = r.rule;
    }

    if (r.analyzer instanceof AnalyzerJS) {
      return await r.analyzer.getStringList(rule);
    }

    if (rule.includes('&&')) {
      const result = [];
      for (const rSimple of rule.split('&&')) {
        const temp = await this._getStringList(r, rSimple);
        if (Array.isArray(temp)) {
          result.push(...temp.map((s) => s?.trim()).filter((s) => s));
        } else if (temp && temp.trim()) {
          result.push(temp.trim());
        }
      }
      return result;
    } else if (rule.includes('||')) {
      let result: string[] = [];
      for (const rSimple of rule.split('||')) {
        const temp = await this._getStringList(r, rSimple);
        if (Array.isArray(temp)) {
          result = temp.map((s) => s?.trim()).filter((s) => s);
        } else if (temp && temp.trim()) {
          result = [temp.trim()];
        }
        if (result.length > 0) {
          return result;
        }
      }
    } else {
      return await r.analyzer.getStringList(rule);
    }

    return [];
  }

  public async getStringList(rule: string, body: string): Promise<string[]> {
    if (!rule) return [];
    const expressionPattern = /\{\{(.*?)\}\}/g;

    const pLeft = rule.lastIndexOf('{{');
    const pRight = rule.lastIndexOf('}}');
    if (pLeft > -1 && pLeft < pRight) {
      let position = 0;
      const rs: string[] = [];
      for (const match of rule.matchAll(expressionPattern)) {
        rs.push(rule.substring(position, match.index));
        position = (match.index as number) + match[0].length;
        rs.push(await this.getString(match[1], body));
      }

      if (position < rule.length) rs.push(rule.substring(position));

      return rs.filter((e) => e);
    }

    let temp: string | string[] = body;
    for (const r of this.splitRuleReversed(rule)) {
      r.analyzer.parse(temp as string);
      temp = await this._getStringList(r);
      if (r.replace) temp = this.replaceSmart(r.replace)(Array.isArray(temp) ? temp.join('\n') : temp);
    }
    return Array.isArray(temp) ? temp : [temp];
  }

  public async parseJsUrl(url: string) {
    if (url.startsWith('@js:')) return await this.JSEngine.evaluate(url.substring(4));
    return url;
  }

  public async getUrl(rule: string, host = '', body = ''): Promise<string> {
    let url = await this.getString(rule, body);
    if (typeof url !== 'string') return url;

    if (url.startsWith('//')) {
      if (host.startsWith('https')) url = `https:${url}`;
      else url = `http:${url}`;
    } else if (url.startsWith('/')) {
      url = host + url;
    }

    return url;
  }
}
