import { Elements } from '../javascript/jsoup/Elements';
import { Element } from '../javascript/jsoup/Element';
import { Jsoup } from '../javascript/jsoup/Jsoup';
import { AnalyzerManager } from './AnalyzerManager';
import { RuleEvaluator } from './common';

export class DefaultEvaluator extends RuleEvaluator {
  private evals: RuleEvaluator[];

  constructor(evals: RuleEvaluator[]) {
    super();
    this.evals = evals;
  }

  override getString0(context: AnalyzerManager, value: any): string {
    return this.getStrings(context, value)?.[0] || '';
  }

  override getStrings(context: AnalyzerManager, value: any): string[] | null {
    if (!value) return [];
    const doc = value as Elements;
    const elements = new Elements(doc);

    for (const _eval of this.evals) {
      if (_eval instanceof Last) {
        return _eval.getStrings(context, elements);
      }
      const els = new Elements();

      for (const element of elements) {
        const result = _eval.getElements(context, element);
        els.push(...result);
      }

      elements.clear();
      elements.push(...els);
    }

    throw new Error('缺少获取文本规则');
  }

  override getElement(context: AnalyzerManager, value: any): any {
    return this.getElements(context, value);
  }

  override getElements(context: AnalyzerManager, value: any): any[] {
    if (!value) return [];
    const doc = value as Elements;
    const elements = new Elements(doc);

    for (const _eval of this.evals) {
      if (_eval instanceof Last) {
        throw new Error('不应存在获取文本规则');
      }
      const els = new Elements();

      for (const element of elements) {
        const result = _eval.getElements(context, element);
        els.push(...result);
      }

      elements.clear();
      elements.addAll(els);
    }

    return elements;
  }

  toString(): string {
    return this.evals.map((_eval) => _eval.toString()).join('@');
  }

  static Adapter = class extends RuleEvaluator {
    private defaultEvaluator: RuleEvaluator;
    private jsonPathEvaluator: RuleEvaluator;

    constructor(defaultEvaluator: RuleEvaluator, jsonPathEvaluator: RuleEvaluator) {
      super();
      this.defaultEvaluator = defaultEvaluator;
      this.jsonPathEvaluator = jsonPathEvaluator;
    }

    override getStrings(context: AnalyzerManager, value: any): string[] | null {
      return context.isJSON ? this.jsonPathEvaluator.getStrings(context, value) : this.defaultEvaluator.getStrings(context, value);
    }

    override getElements(context: AnalyzerManager, value: any): any[] {
      return context.isJSON ? this.jsonPathEvaluator.getElements(context, value) : this.defaultEvaluator.getElements(context, value);
    }

    override getString0(context: AnalyzerManager, value: any): string {
      return context.isJSON ? this.jsonPathEvaluator.getString(context, value) : this.defaultEvaluator.getString0(context, value);
    }

    override getElement(context: AnalyzerManager, value: any): any {
      return context.isJSON ? this.jsonPathEvaluator.getElement(context, value) : this.defaultEvaluator.getElement(context, value);
    }

    toString(): string {
      return this.defaultEvaluator.toString();
    }
  };

  static ConvertWrapper = class extends RuleEvaluator {
    private _eval: RuleEvaluator;

    constructor(_eval: RuleEvaluator) {
      super();
      this._eval = _eval;
    }

    private parse(doc: any): any {
      if (doc instanceof Elements) {
        return doc;
      }

      if (doc instanceof Element) {
        return doc;
      }
      // if (doc instanceof JXNode) {
      //     return doc.isElement() ? doc.asElement() : Jsoup.parse(doc.toString());
      // }

      // try {
      //     if (doc.toString().startsWith("<?xml", 0)) {
      //         return Jsoup.parse(doc.toString(), Jsoup.parser.xmlParser());
      //     }
      // } catch (e) {
      //     // 处理解析异常或错误
      // }

      return Jsoup.parse(doc.toString());
    }

    override getStrings(context: AnalyzerManager, value: any): string[] | null {
      if (!value) return null;
      return this._eval.getStrings(context, this.parse(value));
    }

    override getElements(context: AnalyzerManager, value: any): any[] {
      if (!value) return [];
      return this._eval.getElements(context, this.parse(value));
    }

    override getString0(context: AnalyzerManager, value: any): string {
      if (!value) return '';
      return this._eval.getString0(context, this.parse(value));
    }

    override getElement(context: AnalyzerManager, value: any): any {
      if (!value) return null;
      return this._eval.getElement(context, this.parse(value));
    }

    toString(): string {
      return this._eval.toString();
    }
  };

  static Children = class extends RuleEvaluator {
    constructor(
      private explicit: boolean,
      public index: RuleEvaluator | null
    ) {
      super();
    }

    override getElements(context: AnalyzerManager, value: any): any[] {
      const element = value as Elements;
      const result = element.children();
      return this.index ? this.index.getElements(context, result) : result;
    }

    override toString(): string {
      return `${this.explicit ? 'children' : ''}${this.index ? this.index.toString() : ''}`;
    }
  };

  static Index = class extends RuleEvaluator {
    private exclude: boolean;
    private indexDefault: number[];
    private indexes: Array<number | [number | null, number | null, number]>;

    private static nullSet = new Set([null]);

    constructor(exclude: boolean, indexDefault: number[], indexes: Array<number | [number | null, number | null, number]>) {
      super();
      this.exclude = exclude;
      this.indexDefault = indexDefault;
      this.indexes = indexes;
    }

    getElements(context: AnalyzerManager, value: any): Elements {
      const elements: Elements = value as Elements;
      const len = elements.length;
      const lastIndexes = this.indexDefault.length > 0 ? this.indexDefault.length - 1 : this.indexes.length - 1;
      const indexSet = new Set<number>();

      if (this.indexes.length === 0) {
        for (let ix = lastIndexes; ix >= 0; ix--) {
          const it = this.indexDefault[ix];
          if (it >= 0 && it < len) {
            indexSet.add(it);
          } else if (it < 0 && len >= -it) {
            indexSet.add(it + len);
          }
        }
      } else {
        for (let ix = lastIndexes; ix >= 0; ix--) {
          const index = this.indexes[ix];

          if (Array.isArray(index) && index.length === 3) {
            const [startX, endX, stepX] = index;

            const start = startX === null ? 0 : Math.max(0, startX >= 0 ? Math.min(startX, len - 1) : len + startX);
            const end = endX === null ? len - 1 : Math.max(0, endX >= 0 ? Math.min(endX, len - 1) : len + endX);

            if (start === end || Math.abs(stepX) >= len) {
              indexSet.add(start);
              continue;
            }

            const step = stepX > 0 ? stepX : Math.abs(stepX) < len ? stepX + len : 1;

            if (end > start) {
              for (let i = start; i <= end; i += step) {
                indexSet.add(i);
              }
            } else {
              for (let i = start; i >= end; i += step) {
                indexSet.add(i);
              }
            }
          } else {
            const it = index as number;
            if (it >= 0 && it < len) {
              indexSet.add(it);
            } else if (it < 0 && len >= -it) {
              indexSet.add(it + len);
            }
          }
        }
      }

      if (this.exclude) {
        for (const pcInt of indexSet) {
          elements[pcInt] = null;
        }

        elements.forEach((item, index) => {
          if (item === null) {
            elements.splice(index, 1);
          }
        });

        return elements;
      } else {
        const es = new Elements();
        for (const pcInt of indexSet) {
          es.push(elements[pcInt]);
        }
        return es;
      }
    }

    toString(): string {
      const result: string[] = [];
      if (this.indexDefault.length > 0) {
        result.push(this.exclude ? '!' : '.');
        result.push(this.indexDefault.reverse().join(':'));
      } else {
        result.push('[');
        if (this.exclude) result.push('!');
        this.indexes.reverse().forEach((index, i) => {
          if (i > 0) result.push(',');
          if (Array.isArray(index) && index.length === 3) {
            const [start, end, step] = index;
            if (start !== null) result.push(`${start}`);
            result.push(':');
            if (end !== null) result.push(`${end}`);
            if (step !== 1) {
              result.push(':');
              result.push(`${step}`);
            }
          } else {
            result.push(`${index}`);
          }
        });
        result.push(']');
      }
      return result.join('');
    }
  };
}

export abstract class Select extends RuleEvaluator {
  protected index?: RuleEvaluator | null;

  constructor(index?: RuleEvaluator | null) {
    super();
    this.index = index;
  }

  abstract evaluator(value: Elements): Elements;

  override getElement(context: AnalyzerManager, value: any): any {
    return this.getElements(context, value);
  }

  override getElements(context: AnalyzerManager, value: any): any[] {
    const result = this.evaluator(value as Elements);
    return this.index ? this.index.getElements(context, result) : result;
  }

  static Class = class extends Select {
    private name: string;

    constructor(name: string, index?: RuleEvaluator | null) {
      super(index);
      this.name = name;
    }

    override evaluator(value: Elements): Elements {
      return value.select(`.${this.name}`);
    }

    toString(): string {
      return `class.${this.name}${this.index ? this.index.toString() : ''}`;
    }
  };

  static Tag = class extends Select {
    private name: string;

    constructor(name: string, index?: RuleEvaluator | null) {
      super(index);
      this.name = name;
    }

    override evaluator(value: Elements): Elements {
      return value.select(this.name);
    }

    toString(): string {
      return `tag.${this.name}${this.index ? this.index.toString() : ''}`;
    }
  };

  static Id = class extends Select {
    private name: string;

    constructor(name: string, index?: RuleEvaluator | null) {
      super(index);
      this.name = name;
    }

    override evaluator(value: Elements): Elements {
      return value.select(`#${this.name}`);
    }

    toString(): string {
      return `id.${this.name}${this.index ? this.index.toString() : ''}`;
    }
  };

  static Text = class extends Select {
    private searchText: string;

    constructor(searchText: string, index?: RuleEvaluator | null) {
      super(index);
      this.searchText = searchText;
    }

    override evaluator(value: Elements): Elements {
      // cheerio 没有实现 containsOwn ，需要自己扩展 cheerio 实现，先用 contains 代替
      return value.select(`:contains(${this.searchText})`);
    }

    toString(): string {
      return `text.${this.searchText}${this.index ? this.index.toString() : ''}`;
    }
  };

  static Css = class extends Select {
    private query: string;
    private prefix: boolean;

    constructor(query: string, prefix: boolean, index?: RuleEvaluator | null) {
      super(index);
      this.query = query;
      this.prefix = prefix;
    }

    override evaluator(value: Elements): Elements {
      return value.select(this.query);
    }

    toString(): string {
      let result = '';
      if (this.prefix) result += '@css:';
      result += this.query;
      if (this.index) result += this.index.toString();
      return result;
    }
  };
}

export abstract class Last extends RuleEvaluator {
  abstract getStrings(context: AnalyzerManager, value: any): string[];

  static Text = new (class extends Last {
    getStrings(context: AnalyzerManager, value: any): string[] {
      const result: string[] = [];
      const elements = value as Elements;

      for (let i = 0; i < elements.length; i++) {
        const text = elements[i].text();
        if (text) {
          result.push(text);
        }
      }

      return result;
    }

    toString(): string {
      return 'text';
    }
  })();

  static TextNodes = new (class extends Last {
    getStrings(context: AnalyzerManager, value: any): string[] {
      const result: string[] = [];
      const elements = value as Elements;
      const sb: string[] = [];

      for (let i = 0; i < elements.length; i++) {
        const contentEs = elements[i].textNodes();

        for (let a = 0; a < contentEs.length; a++) {
          const item = contentEs[a];
          const text = item.text().trim();

          if (text) {
            if (a > 0) sb.push('\n');
            sb.push(text);
          }
        }

        if (sb.length > 0) {
          result.push(sb.join(''));
          sb.length = 0;
        }
      }

      return result;
    }

    toString(): string {
      return 'textNodes';
    }
  })();

  static OwnText = new (class extends Last {
    getStrings(context: AnalyzerManager, value: any): string[] {
      const result: string[] = [];
      const elements = value as Elements;

      for (let i = 0; i < elements.length; i++) {
        const text = elements[i].ownText();
        if (text) {
          result.push(text);
        }
      }

      return result;
    }

    toString(): string {
      return 'ownText';
    }
  })();

  static Html = new (class extends Last {
    getStrings(context: AnalyzerManager, value: any): string[] {
      const result: string[] = [];
      const elements = value as Elements;

      elements.select('script, style').remove(); // 移除 script 和 style 标签
      const html = elements.outerHtml();

      if (html) {
        result.push(html);
      }

      return result;
    }

    toString(): string {
      return 'html';
    }
  })();

  static All = new (class extends Last {
    getStrings(context: AnalyzerManager, value: any): string[] {
      const result: string[] = [];
      const elements = value as Elements;
      result.push(elements.outerHtml());
      return result;
    }

    toString(): string {
      return 'all';
    }
  })();

  static Attr = class extends Last {
    private name: string;

    constructor(name: string) {
      super();
      this.name = name;
    }

    getStrings(context: AnalyzerManager, value: any): string[] {
      const result: string[] = [];
      const elements = value as Elements;

      for (let i = 0; i < elements.length; i++) {
        const url = elements[i].attr(this.name);
        if (!url || result.includes(url)) continue;
        result.push(url);
      }

      return result;
    }

    toString(): string {
      return this.name;
    }
  };
}
