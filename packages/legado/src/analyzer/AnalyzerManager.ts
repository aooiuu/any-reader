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

  getStringList(rule: string | RuleEvaluator) {
    if (typeof rule === 'string') {
      return SourceRuleParser.parseStrings(rule).getStrings(this, this.content);
    } else {
      return rule.getStrings(this, this.content);
    }
  }

  getString(
    rule: RuleEvaluator | null,
    content: any | null = null,
    isUrl: boolean = false
    // unescape: boolean = true,
  ) {
    let result = '';
    const currentContent = content ?? this.content;

    if (currentContent && rule) {
      result = isUrl ? rule.getString0(this, currentContent) : rule.getString(this, currentContent);
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

  getElements(rule: string | RuleEvaluator) {
    if (typeof rule === 'string') {
      return SourceRuleParser.parseElements(rule).getElements(this, this.content);
    } else {
      return rule.getElements(this, this.content);
    }
  }

  parseStrings(rule: string) {
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
