import { NetworkUtils } from '../utils/NetworkUtils';
import { RuleEvaluator } from './RuleEvaluator';
import { SourceRuleParser } from './SourceRuleParser';

export class AnalyzerManager {
  content: any | null;
  isJSON: boolean = false;
  baseUrl: string = '';
  redirectUrl: URL | null = null;

  constructor(content: string) {
    this.content = content;
  }

  setContent(content: any) {
    this.content = content;
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setRedirectUrl(redirectUrl: string) {
    try {
      this.redirectUrl = new URL(redirectUrl);
    } catch (error) {
      console.error(error);
    }
  }

  getStringList(rule: string | RuleEvaluator | null, content: any | null = null, isUrl: boolean = false) {
    if (!rule) {
      return null;
    }

    if (typeof rule === 'string') {
      if (!rule.trim()) {
        return null;
      }
      rule = SourceRuleParser.parseStrings(rule);
    } else {
      return rule.getStrings(this, this.content);
    }

    content ??= this.content;

    if (!content) {
      return null;
    }

    const result = rule.getStrings(this, content);

    if (isUrl) {
      if (Array.isArray(result)) {
        const urlList: string[] = [];
        for (const url of result) {
          const absoluteURL = NetworkUtils.getAbsoluteURL2(this.redirectUrl, url.toString());
          if (absoluteURL && !urlList.includes(absoluteURL)) {
            urlList.push(absoluteURL);
          }
        }
      }
      return [];
    }
    return result;
  }

  getString(
    rule: RuleEvaluator | string | null,
    content: any | null = null,
    isUrl: boolean = false
    // unescape: boolean = true,
  ) {
    if (!rule) {
      return '';
    }

    if (typeof rule === 'string') {
      if (!rule.trim()) {
        return '';
      }
      rule = SourceRuleParser.parseStrings(rule);
    }

    let result = '';

    content ??= this.content;

    if (content && rule) {
      result = isUrl ? rule.getString0(this, content) : rule.getString(this, content);
    }

    // const str =
    //   unescape && !isUrl && result.includes("&")
    //     ? StringEscapeUtils.unescapeHtml4(result)
    //     : result;

    const str = result;

    if (isUrl) {
      return str.trim() === '' ? this.baseUrl : NetworkUtils.getAbsoluteURL2(this.redirectUrl, str);
    }

    return str;
  }

  getElement(rule: string) {
    if (!rule.trim()) return null;
    return SourceRuleParser.parseElements(rule).getElement(this, this.content);
  }

  getElements(rule: string) {
    if (!rule.trim()) return [];
    return SourceRuleParser.parseElements(rule).getElements(this, this.content);
  }

  parseStrings(rule: string) {
    if (!rule.trim()) return null; // 没有规则, 返回空白, 不然后面会报错
    return SourceRuleParser.parseStrings(rule);
  }

  put(_key: string, _value: any | null) {
    throw new Error('未实现');
  }

  get(_key: string): string {
    throw new Error('未实现');
    return '';
  }

  evalJS(_script: string, _result: any | null): any {}
}
