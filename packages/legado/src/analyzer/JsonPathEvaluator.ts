import { JSONPath } from 'jsonpath-plus';
import { AnalyzerManager } from './AnalyzerManager';
import { RuleEvaluator } from './common';

class JsonPath {
  static parse(content: any): ReadContext {
    return new ReadContext(content);
  }
}
class ReadContext {
  private _content: any;

  constructor(content: string) {
    this._content = typeof content === 'string' ? JSON.parse(content) : content;
  }

  read(jsonPath: string) {
    const rows = JSONPath({
      path: jsonPath,
      json: this._content
    });
    if (Array.isArray(rows) && rows.length === 1) return rows[0];

    return rows;
  }
}

export class JsonPathEvaluator extends RuleEvaluator {
  private jsonpath: string;

  constructor(jsonpath: string) {
    super();
    this.jsonpath = jsonpath;
  }

  getString(context: AnalyzerManager, value: any): string {
    if (!this.jsonpath) return '';
    return this.getStrings(context, value).join('\n');
  }

  getStrings(_context: AnalyzerManager, value: any): string[] {
    const ctx = value as ReadContext;
    if (!this.jsonpath) return [];
    const result: string[] = [];
    try {
      const obj = ctx.read(this.jsonpath);
      if (Array.isArray(obj)) {
        obj.forEach((item) => result.push(item.toString()));
      } else {
        result.push(obj.toString());
      }
    } catch (e) {
      console.error(e);
    }
    return result;
  }

  getElements(_context: AnalyzerManager, value: any): any[] {
    const ctx = value as ReadContext;
    try {
      return ctx.read(this.jsonpath);
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  getElement(_context: AnalyzerManager, value: any): any {
    const ctx = value as ReadContext;
    return ctx.read(this.jsonpath);
  }

  toString(): string {
    return this.jsonpath;
  }

  static ConvertWrapper = class extends RuleEvaluator {
    private _eval: RuleEvaluator;

    constructor(_eval: RuleEvaluator) {
      super();
      this._eval = _eval;
    }

    private parse(json: any): ReadContext {
      if (json instanceof ReadContext) {
        return json;
      } else if (typeof json === 'string') {
        return JsonPath.parse(json);
      } else {
        return JsonPath.parse(json);
      }
    }

    getString(context: AnalyzerManager, value: any): string {
      if (!value) return '';
      return this._eval.getString(context, this.parse(value));
    }

    getStrings(context: AnalyzerManager, value: any): string[] | null {
      if (!value) return null;
      return this._eval.getStrings(context, this.parse(value));
    }

    getElements(context: AnalyzerManager, value: any): any[] {
      if (!value) return [];
      return this._eval.getElements(context, this.parse(value));
    }

    getElement(context: AnalyzerManager, value: any): any | null {
      if (!value) return null;
      return this._eval.getElement(context, this.parse(value));
    }

    toString(): string {
      return this._eval.toString();
    }
  };
}
