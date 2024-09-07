import { CombineEvaluator } from './CombineEvaluator';
import { DefaultEvaluator, Last, Select } from './DefaultEvaluator';
import { FormatEvaluator } from './FormatEvaluator';
import { JsEvaluator } from './JsEvaluator';
import { JsonPathEvaluator } from './JsonPathEvaluator';
import { RegexEvaluator } from './RegexEvaluator';
import { RuleAnalyzer } from './RuleAnalyzer';
import { RuleEvaluator } from './RuleEvaluator';
import { parseJson } from './utils';
import { XPathEvaluator } from './XPathEvaluator';

export class SourceRuleParser {
  private sourceRule: string;
  private getString: boolean;
  private mustache: boolean;

  constructor(sourceRule: string, getString: boolean, mustache: boolean = false) {
    this.sourceRule = sourceRule;
    this.getString = getString;
    this.mustache = mustache;
  }

  parse(): RuleEvaluator {
    if (this.mustache && !this.isRule(this.sourceRule)) {
      return new JsEvaluator.Js(new JsEvaluator.ScriptLiteral(this.sourceRule), '');
    }

    // allInOne
    if (!this.getString && !this.mustache && this.sourceRule.startsWith(':')) {
      this.sourceRule = this.sourceRule.substring(1);
      return new RegexEvaluator.AllInOne(splitNotBlank(this.sourceRule, '&&'));
    }

    function splitNotBlank(str: string, separator = ',') {
      return str
        .split(separator)
        .map((s) => s.trim())
        .filter((s) => s !== '');
    }

    const rules = this.separateRule(this.sourceRule);
    const rootEvals: RuleEvaluator[] = [];

    for (let i = 0; i < rules.length; i++) {
      const originRule = rules[i];
      let rule = originRule;
      const evals: RuleEvaluator[] = [];

      // 解析 put
      const putMap: Map<string, RuleEvaluator> = new Map();
      rule = this.parsePutRule(rule, putMap);
      if (putMap.size > 0) {
        evals.push(new RuleEvaluator.Put(putMap));
      }

      // 处理规则分隔部分
      const prefix = this.parsePrefix(rule);
      if (prefix === '<js>') {
        rule = rule.substring(4, rule.length - 5);
      } else if (prefix !== null) {
        rule = rule.substring(prefix.length);
      }

      let regexEval: RuleEvaluator | null = null;
      // 解析 插值 @get {{ }} $1
      if (prefix !== '<js>' && prefix !== '@js:') {
        const formatEval = this.parseFormat(rule);
        if (formatEval != null) {
          evals.push(formatEval[0]);
          // 解析 正则
          if (formatEval[1].includes('##')) {
            const regexResult = this.parseRegexRule(formatEval[1]);
            if (regexResult) {
              evals.push(regexResult[1]);
            }
          }
          rootEvals.push(this.sequenceIfNeed(evals));
          continue;
        }
      }

      // 解析 正则
      const regexResult = this.parseRegexRule(rule);
      if (regexResult) {
        rule = regexResult[0];
        regexEval = regexResult[1];
      }
      if (!rule) {
        if (regexEval) evals.push(regexEval);
        rootEvals.push(this.sequenceIfNeed(evals));
        continue;
      }

      // 解析规则
      const _eval = this.parseRule(rule, prefix);
      if (this.getString && !this.mustache && rootEvals.length === 0) {
        // 第一条规则
        const nativeObjectEvaluator = new RuleEvaluator.NativeObjectEvaluator(originRule);
        evals.push(new RuleEvaluator.NativeObjectAdapter(_eval, nativeObjectEvaluator));
      } else {
        evals.push(_eval);
      }
      if (regexEval) evals.push(regexEval);
      rootEvals.push(this.sequenceIfNeed(evals));
    }

    return this.sequenceIfNeed(rootEvals);
  }

  private isRule(ruleStr: string): boolean {
    return ruleStr.startsWith('@') || ruleStr.startsWith('$.') || ruleStr.startsWith('$[') || ruleStr.startsWith('//');
  }

  private sequenceIfNeed(evals: RuleEvaluator[]): RuleEvaluator {
    return evals.length === 1 ? evals[0] : new RuleEvaluator.Sequence(evals);
  }

  private parseRule(ruleStr: string, prefix: string | null): RuleEvaluator {
    switch (prefix) {
      case '<js>':
      case '@js:':
        return this.parseJsRule(ruleStr, prefix);
      case '@css:':
      case '@@':
        return this.parseDefaultRule(ruleStr, prefix);
      case '@xpath:':
        return this.parseXpathRule(ruleStr);
      case '@json:':
        return this.parseJsonPathRule(ruleStr);
    }

    if (ruleStr.startsWith('$.') || ruleStr.startsWith('$[')) {
      return this.parseJsonPathRule(ruleStr);
    }

    if (ruleStr.startsWith('/')) {
      return new DefaultEvaluator.Adapter(this.parseXpathRule(ruleStr), this.parseJsonPathRule(ruleStr));
    }

    return new DefaultEvaluator.Adapter(this.parseDefaultRule(ruleStr, ''), this.parseJsonPathRule(ruleStr));
  }

  private parseJsonPathRule(ruleStr: string): RuleEvaluator {
    const evals: RuleEvaluator[] = [];

    const ruleAnalyzes = new RuleAnalyzer(ruleStr, true);
    const rules = ruleAnalyzes.splitRule('&&', '||', '%%');

    for (const rl of rules) {
      const ruleAnalyzer = new RuleAnalyzer(rl, true);
      const result = ruleAnalyzer.splitInnerRule('{$.');

      if (result.length === 0) {
        evals.push(new JsonPathEvaluator(rl));
      } else {
        evals.push(this.parseJsonPathFormat(result));
      }
    }

    const combineEvaluator = this.parseCombineOperate(ruleAnalyzes.elementsType, evals);

    return new JsonPathEvaluator.ConvertWrapper(combineEvaluator);
  }

  private parseJsonPathFormat(rules: string[]): RuleEvaluator {
    const evals: RuleEvaluator[] = [];
    for (const rule of rules) {
      if (rule.startsWith('{$.')) {
        const path = rule.substring(1, rule.length - 1);
        evals.push(new FormatEvaluator.JsonPath(new JsonPathEvaluator(path)));
      } else {
        evals.push(new FormatEvaluator.Literal(rule));
      }
    }
    return new FormatEvaluator(evals);
  }

  private parseXpathRule(ruleStr: string): RuleEvaluator {
    const evals: RuleEvaluator[] = [];

    const ruleAnalyzes = new RuleAnalyzer(ruleStr);
    const rules = ruleAnalyzes.splitRule('&&', '||', '%%');

    for (const rl of rules) {
      evals.push(new XPathEvaluator(rl));
    }

    const combineEvaluator = this.parseCombineOperate(ruleAnalyzes.elementsType, evals);

    return new XPathEvaluator.ConvertWrapper(combineEvaluator);
  }

  private parseJsRule(ruleStr: string, prefix: string): RuleEvaluator {
    const formatResult = this.parseFormat(ruleStr, false);

    const script = formatResult ? new JsEvaluator.ScriptEval(formatResult[0]) : new JsEvaluator.ScriptLiteral(ruleStr);

    return new JsEvaluator.Js(script, prefix);
  }

  private parseDefaultRule(ruleStr: string, prefix: string): RuleEvaluator {
    const evals: RuleEvaluator[] = [];

    const ruleAnalyzes = new RuleAnalyzer(ruleStr);
    const ruleStrS = ruleAnalyzes.splitRule('&&', '||', '%%');

    if (prefix === '@css:') {
      for (const [index, ruleStrX] of ruleStrS.entries()) {
        if (this.getString) {
          const lastIndex = ruleStrX.lastIndexOf('@');
          const query = ruleStrX.substring(0, lastIndex);
          const cssEvaluator = new Select.Css(query, index === 0);
          const endEvaluator = this.parseDefaultEnd(ruleStrX.substring(lastIndex + 1));
          evals.push(new DefaultEvaluator([cssEvaluator, endEvaluator]));
        } else {
          evals.push(new Select.Css(ruleStrX, index === 0));
        }
      }
      const combineEvaluator = this.parseCombineOperate(ruleAnalyzes.elementsType, evals);
      return new DefaultEvaluator.ConvertWrapper(combineEvaluator);
    }

    for (const ruleStrX of ruleStrS) {
      if (!ruleStrX.trim()) {
        continue;
      }
      const subEvals: RuleEvaluator[] = [];
      const rule = new RuleAnalyzer(ruleStrX); // 创建解析
      rule.trim(); // 修建前置赘余符号
      const rules = rule.splitRule('@'); // 切割成列表
      const last = this.getString ? rules.length - 1 : rules.length;

      for (let i = 0; i < last; i++) {
        const [ruleNoIndex, index] = this.parseIndexSet(rules[i]);
        subEvals.push(this.parseDefaultSelect(ruleNoIndex, index));
      }

      if (this.getString) {
        subEvals.push(this.parseDefaultEnd(rules[rules.length - 1]));
      }

      evals.push(new DefaultEvaluator(subEvals));
    }

    const combineEvaluator = this.parseCombineOperate(ruleAnalyzes.elementsType, evals);
    return new DefaultEvaluator.ConvertWrapper(combineEvaluator);
  }

  private parseCombineOperate(op: string, evals: RuleEvaluator[]): RuleEvaluator {
    if (evals.length === 1) {
      return evals[0];
    }
    switch (op) {
      case '&&':
        return new CombineEvaluator.And(evals);
      case '||':
        return new CombineEvaluator.Or(evals);
      case '%%':
        return new CombineEvaluator.Transpose(evals);
      default:
        return evals[0];
    }
  }

  private parseDefaultSelect(ruleStr: string, index: RuleEvaluator | null): RuleEvaluator {
    if (!ruleStr) {
      return new DefaultEvaluator.Children(false, index);
    } else {
      const rules = ruleStr.split('.');
      switch (rules[0]) {
        case 'children':
          return new DefaultEvaluator.Children(true, index);
        case 'class':
          return new Select.Class(rules[1], index);
        case 'tag':
          return new Select.Tag(rules[1], index);
        case 'id':
          return new Select.Id(rules[1], index);
        case 'text':
          return new Select.Text(rules[1], index);
        default:
          return new Select.Css(ruleStr, false, index);
      }
    }
  }

  private parseDefaultEnd(end: string): RuleEvaluator {
    switch (end) {
      case 'text':
        return Last.Text;
      case 'textNodes':
        return Last.TextNodes;
      case 'ownText':
        return Last.OwnText;
      case 'html':
        return Last.Html;
      case 'all':
        return Last.All;
      default:
        return new Last.Attr(end);
    }
  }

  private parseIndexSet(rule: string): [string, RuleEvaluator | null] {
    const indexDefault: number[] = [];
    const indexes: any[] = [];
    let split = '.';
    let beforeRule: string;

    const rus = rule.trim();
    let len = rus.length;
    let curInt: number | null; // 当前数字
    let curMinus = false; // 当前数字是否为负
    const curList: (number | null)[] = []; // 当前数字区间
    let l = ''; // 暂存数字字符串

    const head = rus[rus.length - 1] === ']'; // 是否为常规索引写法

    if (head) {
      // 常规索引写法[index...]
      len--; // 跳过尾部']'

      while (len-- >= 0) {
        // 逆向遍历, 可以无前置规则
        const rl = rus[len];
        if (rl === ' ') continue; // 跳过空格

        if (rl >= '0' && rl <= '9') {
          l = rl + l; // 将数值累接入临时字串中，遇到分界符才取出
        } else if (rl === '-') {
          curMinus = true;
        } else {
          curInt = l.length === 0 ? null : curMinus ? -parseInt(l) : parseInt(l); // 当前数字

          switch (rl) {
            case ':':
              curList.push(curInt); // 区间右端或区间间隔
              break;

            default:
              // 为保证查找顺序，区间和单个索引都添加到同一集合
              if (curList.length === 0) {
                if (curInt === null) break; // 是jsoup选择器而非索引列表，跳出
                indexes.push(curInt);
              } else {
                // 列表最后压入的是区间右端，若列表有两位则最先压入的是间隔
                indexes.push([curInt, curList[curList.length - 1], curList.length === 2 ? curList[0] : 1]);

                curList.length = 0; // 重置临时列表，避免影响到下个区间的处理
              }

              if (rl === '!') {
                split = '!';
                do {
                  len--;
                } while (len > 0 && rus[len] === ' '); // 跳过所有空格
              }

              if (rl === '[') {
                beforeRule = rus.substring(0, len); // 遇到索引边界，返回结果
                return [beforeRule, new DefaultEvaluator.Index(split === '!', indexDefault, indexes)];
              }

              if (rl !== ',') break; // 非索引结构，跳出
          }
          l = ''; // 清空
          curMinus = false; // 重置
        }
      }
    } else {
      while (len-- >= 0) {
        // 阅读原本写法，逆向遍历，可以无前置规则
        const rl = rus[len];
        if (rl === ' ') continue; // 跳过空格

        if (rl >= '0' && rl <= '9') {
          l = rl + l; // 将数值累接入临时字串中，遇到分界符才取出
        } else if (rl === '-') {
          curMinus = true;
        } else {
          if (rl === '!' || rl === '.' || rl === ':') {
            // 分隔符或起始符
            indexDefault.push(curMinus ? -parseInt(l) : parseInt(l)); // 当前数字追加到列表

            if (rl !== ':') {
              // rl === '!'  || rl === '.'
              split = rl;
              beforeRule = rus.substring(0, len);
              return [beforeRule, new DefaultEvaluator.Index(split === '!', indexDefault, indexes)];
            }
          } else break; // 非索引结构，跳出循环

          l = ''; // 清空
          curMinus = false; // 重置
        }
      }
    }

    beforeRule = rus;
    return [beforeRule, null];
  }

  private parsePrefix(ruleStr: string): string | null {
    if (ruleStr.startsWith('<js>')) return '<js>';
    if (ruleStr.startsWith('@js:')) return '@js:';
    if (ruleStr.startsWith('@css:')) return '@css:';
    if (ruleStr.startsWith('@@')) return '@@';
    if (ruleStr.startsWith('@xpath:')) return '@xpath:';
    if (ruleStr.startsWith('@json:')) return '@json:';
    return null;
  }

  private parseRegexRule(ruleStr: string): [string, RuleEvaluator] | null {
    const ruleStrS = ruleStr.split('##');
    if (ruleStrS.length === 1) return null;

    let replaceRegex: string | null = null;
    let replacement = '';
    let replaceFirst = false;

    if (ruleStrS.length > 1) {
      replaceRegex = ruleStrS[1];
    }
    if (ruleStrS.length > 2) {
      replacement = ruleStrS[2];
    }
    if (ruleStrS.length > 3) {
      replaceFirst = true;
    }

    let formatResult = this.parseFormat(replaceRegex!, false, false);

    const regexEval = formatResult ? new RegexEvaluator.RegexEval(formatResult[0]) : new RegexEvaluator.RegexLiteral(replaceRegex!);

    formatResult = this.parseFormat(replacement, false, false);

    const replacementEval = formatResult ? new RegexEvaluator.ReplacementEval(formatResult[0]) : new RegexEvaluator.ReplacementLiteral(replacement);

    const _eval = replaceFirst ? new RegexEvaluator.ReplaceFirst(regexEval, replacementEval) : new RegexEvaluator.Replace(regexEval, replacementEval);

    return [ruleStrS[0].trim(), _eval];
  }

  private parseFormat(ruleStr: string, dollarSign: boolean = true, excludeRegex: boolean = true): [RuleEvaluator, string] | null {
    const evals: RuleEvaluator[] = [];
    let start = 0;
    this.evalPattern.lastIndex = 0;
    let matcher = this.evalPattern.exec(ruleStr);

    if (!matcher) return null;

    do {
      if (matcher.index > start) {
        const tmp = ruleStr.substring(start, matcher.index);
        if (tmp.length > 0) {
          if (excludeRegex && tmp.includes('##')) {
            if (evals.length === 0) {
              return null;
            }
            const tmp1 = tmp.split('##')[0];
            if (tmp1.length > 0) {
              evals.push(new FormatEvaluator.Literal(tmp1));
              start += tmp1.length;
            }
            if (evals.length === 0) {
              return null;
            } else {
              break;
            }
          }
          evals.push(new FormatEvaluator.Literal(tmp));
        }
      }

      const group = matcher[0];
      switch (true) {
        case group.startsWith('@get:'):
          evals.push(new FormatEvaluator.Get(group.substring(6)));
          break;

        case group.startsWith('{{'): {
          const rule = group.substring(2, group.length - 2);
          evals.push(new FormatEvaluator.Mustache(SourceRuleParser.parseMustache(rule)));
          break;
        }
        case group.startsWith('$'):
          if (dollarSign) {
            evals.push(new FormatEvaluator.Regex(parseInt(group.substring(1), 10)));
          } else {
            evals.push(new FormatEvaluator.Literal(group));
          }
          break;
      }

      start = matcher.index + matcher[0].length;
    } while ((matcher = this.evalPattern.exec(ruleStr)));

    let tmp = ruleStr.substring(start);
    if (excludeRegex && tmp.includes('##')) {
      tmp = tmp.split('##')[0];
    }
    if (tmp.length > 0) {
      evals.push(new FormatEvaluator.Literal(tmp));
      start += tmp.length;
    }

    return [new FormatEvaluator(evals), ruleStr.substring(start)];
  }

  private separateRule(ruleStr: string): string[] {
    return this.separate(this.JS_PATTERN, ruleStr);
  }

  private separate(pattern: RegExp, str: string): string[] {
    let start = 0;
    const regex = new RegExp(pattern);
    let match = regex.exec(str);
    const strList: string[] = [];

    while (match) {
      if (match.index > start) {
        const tmp = str.substring(start, match.index).trim();
        if (tmp.length > 0) {
          strList.push(tmp);
        }
      }
      strList.push(match[0]);
      start = match.index + match[0].length;

      match = regex.exec(str);
    }

    if (str.length > start) {
      const tmp = str.substring(start).trim();
      if (tmp.length > 0) {
        strList.push(tmp);
      }
    }

    return strList;
  }

  private parsePutRule(ruleStr: string, putMap: Map<string, RuleEvaluator>): string {
    let vRuleStr = ruleStr;
    const regex = new RegExp(this.putPattern);
    let match = regex.exec(vRuleStr);

    while (match) {
      vRuleStr = vRuleStr.replace(match[0], '');
      const jsonString = match[1];
      const map = parseJson<Map<string, string>>(jsonString);

      if (map) {
        for (const [key, value] of Object.entries(map)) {
          putMap.set(key, SourceRuleParser.parseStrings(value));
        }
      }

      match = regex.exec(vRuleStr);
    }

    return vRuleStr;
  }

  private putPattern: RegExp = /@put:(\{[^}]+?\})/gi;
  private evalPattern: RegExp = /@get:\{[^}]+?\}|{{[\s\S]*?}}|(?<!\\)\$\d{1,2}/gi;
  private JS_PATTERN: RegExp = /<js>([\s\S]*?)<\/js>|@js:([\s\S]*)/gi;

  public static parseStrings(sourceRule: string): RuleEvaluator {
    if (!sourceRule || sourceRule.trim().length === 0) {
      throw new Error('规则不能为空');
    }
    return new SourceRuleParser(sourceRule, true).parse();
  }

  public static parseElements(sourceRule: string): RuleEvaluator {
    if (!sourceRule || sourceRule.trim().length === 0) {
      throw new Error('规则不能为空');
    }
    return new SourceRuleParser(sourceRule, false).parse();
  }

  public static parseMustache(sourceRule: string): RuleEvaluator {
    return new SourceRuleParser(sourceRule, true, true).parse();
  }
}
