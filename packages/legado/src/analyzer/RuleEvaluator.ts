import { AnalyzerManager } from './AnalyzerManager';
import { BaseRuleEvaluator } from './BaseRuleEvaluator';
import { isExplicitObject } from './utils';
import { FormatEvaluator, JsEvaluator, RegexEvaluator } from './common';

export abstract class RuleEvaluator extends BaseRuleEvaluator {
  override getString(context: AnalyzerManager, value?: any): string {
    const list = this.getStrings(context, value);

    if (!list || list.length === 0) {
      return '';
    }

    if (list.length === 1) {
      return list[0];
    }

    return list.join('\n');
  }

  override getString0(context: AnalyzerManager, value?: any): string {
    return this.getString(context, value);
  }

  static Sequence = class extends RuleEvaluator {
    private evals: RuleEvaluator[];

    constructor(evals: RuleEvaluator[]) {
      super();
      this.evals = evals;
    }

    override getString0(context: AnalyzerManager, value?: any): string {
      let lastResult = value;
      let result = value;

      for (const _eval of this.evals) {
        if (_eval instanceof RuleEvaluator.Put) {
          result = _eval.eval(context, value);
        } else if (_eval instanceof JsEvaluator.Js) {
          result = _eval.eval(context, result);
        } else if (_eval instanceof FormatEvaluator) {
          result = _eval.getString(context, result);
        } else if (_eval instanceof RegexEvaluator) {
          result = _eval.replace(context, lastResult, result);
        } else {
          result = _eval.getString0(context, result);
        }

        lastResult = result;

        if (isExplicitObject(value)) break;
      }

      return result ? result.toString() : '';
    }

    override getString(context: AnalyzerManager, value?: any): string {
      let lastResult = value;
      let result = value;

      for (const _eval of this.evals) {
        if (_eval instanceof RuleEvaluator.Put) {
          result = _eval.eval(context, lastResult);
        } else if (_eval instanceof JsEvaluator.Js) {
          result = _eval.eval(context, result);
        } else if (_eval instanceof FormatEvaluator) {
          result = _eval.getString(context, result);
        } else if (_eval instanceof RegexEvaluator) {
          result = _eval.replace(context, lastResult, result);
        } else {
          result = _eval.getString(context, result);
        }

        lastResult = result;

        if (isExplicitObject(value)) break;
      }

      return result ? result.toString() : '';
    }

    override getStrings(context: AnalyzerManager, value?: any): string[] | null {
      let lastResult = value;
      let result = value;

      for (const _eval of this.evals) {
        if (_eval instanceof RuleEvaluator.Put) {
          result = _eval.eval(context, lastResult);
        } else if (_eval instanceof JsEvaluator.Js) {
          result = _eval.eval(context, result);
        } else if (_eval instanceof FormatEvaluator) {
          result = _eval.getString(context, result);
        } else if (_eval instanceof RegexEvaluator) {
          if (Array.isArray(result)) {
            result = _eval.replaceList(context, lastResult, result);
          } else {
            result = _eval.replace(context, lastResult, result);
          }
        } else {
          result = _eval.getStrings(context, result);
        }

        lastResult = result;

        if (isExplicitObject(value)) break;
      }

      if (typeof result === 'string') {
        result = result.split('\n');
      }

      return result as string[] | null;
    }

    override getElement(context: AnalyzerManager, value?: any): any {
      let lastResult = value;
      let result = value;

      for (const _eval of this.evals) {
        if (_eval instanceof RuleEvaluator.Put) {
          result = _eval.eval(context, lastResult);
        } else if (_eval instanceof JsEvaluator.Js) {
          result = _eval.eval(context, result);
        } else if (_eval instanceof FormatEvaluator) {
          result = _eval.getString(context, result);
        } else if (_eval instanceof RegexEvaluator) {
          result = _eval.replace(context, lastResult, result);
        } else {
          result = _eval.getElement(context, result);
        }

        lastResult = result;
      }

      return result;
    }

    override getElements(context: AnalyzerManager, value?: any): any[] {
      let lastResult = value;
      let result = value;

      for (const _eval of this.evals) {
        if (_eval instanceof RuleEvaluator.Put) {
          result = _eval.eval(context, lastResult);
        } else if (_eval instanceof JsEvaluator.Js) {
          result = _eval.evalElements(context, result);
        } else if (_eval instanceof FormatEvaluator) {
          result = _eval.getString(context, result);
        } else if (_eval instanceof RegexEvaluator) {
          result = _eval.replaceList(context, lastResult, result);
        } else {
          result = _eval.getElements(context, result);
        }

        lastResult = result;
      }

      return Array.isArray(result) ? result : [];
    }

    override toString(): string {
      return this.evals.map((_eval) => _eval.toString()).join('');
    }
  };

  static Put = class extends RuleEvaluator {
    private putMap: Map<string, RuleEvaluator>;

    constructor(putMap: Map<string, RuleEvaluator>) {
      super();
      this.putMap = putMap;
    }

    override eval(context: AnalyzerManager, value?: any): any {
      this.putMap.forEach((_eval, key) => {
        context.put(key, _eval.getString(context, value));
      });
      return value;
    }

    override getElement(context: AnalyzerManager, value?: any): any {
      this.eval(context, value);
      return [];
    }

    override toString(): string {
      return `@put:${JSON.stringify(Array.from(this.putMap.entries()))}`;
    }
  };

  static NativeObjectEvaluator = class extends RuleEvaluator {
    private key: string;

    constructor(key: string) {
      super();
      this.key = key;
    }

    override getString(context: AnalyzerManager, value?: any): string {
      const nativeObject = value;
      return nativeObject[this.key]?.toString() || '';
    }

    override getStrings(context: AnalyzerManager, value?: any): string[] | null {
      const nativeObject = value;
      const result = nativeObject[this.key];

      if (result === undefined) {
        return null;
      }

      if (Array.isArray(result)) {
        return result.map((item) => item.toString());
      } else {
        return result.toString().split('\n');
      }
    }

    override toString(): string {
      return this.key;
    }
  };

  static NativeObjectAdapter = class extends RuleEvaluator {
    private _eval: RuleEvaluator;
    private nativeObjectEvaluator: RuleEvaluator;

    constructor(_eval: RuleEvaluator, nativeObjectEvaluator: RuleEvaluator) {
      super();
      this._eval = _eval;
      this.nativeObjectEvaluator = nativeObjectEvaluator;
    }

    override getString(context: AnalyzerManager, value?: any): string {
      if (this.isExplicitObject(value)) {
        return this.nativeObjectEvaluator.getString(context, value);
      } else {
        return this._eval.getString(context, value);
      }
    }

    override getStrings(context: AnalyzerManager, value?: any): string[] | null {
      if (this.isExplicitObject(value)) {
        return this.nativeObjectEvaluator.getStrings(context, value);
      } else {
        return this._eval.getStrings(context, value);
      }
    }

    override getString0(context: AnalyzerManager, value?: any): string {
      if (this.isExplicitObject(value)) {
        return this.nativeObjectEvaluator.getString(context, value);
      } else {
        return this._eval.getString0(context, value);
      }
    }

    override toString(): string {
      return this._eval.toString();
    }

    private isExplicitObject(value: any) {
      return typeof value === 'object' && value !== null && value.constructor === Object;
    }
  };
}
