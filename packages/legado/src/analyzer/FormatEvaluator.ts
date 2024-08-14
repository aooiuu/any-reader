import { AnalyzerManager } from './AnalyzerManager';
import { JsEvaluator, RuleEvaluator } from './common';

export class FormatEvaluator extends RuleEvaluator {
  evals: RuleEvaluator[];

  constructor(evals: RuleEvaluator[]) {
    super();
    this.evals = evals;
  }

  getString(context: AnalyzerManager, value: any): string {
    return this.evals
      .map((_eval) => _eval.getString(context, value))
      .join('')
      .trim();
  }

  getStrings(context: AnalyzerManager, value: any): string[] {
    return this.getString(context, value).split('\n');
  }

  toString(): string {
    return this.evals.join('');
  }

  static Get = class extends RuleEvaluator {
    key: string;

    constructor(key: string) {
      super();
      this.key = key;
    }

    getString(context: AnalyzerManager, _value: any): string {
      return context.get(this.key);
    }

    toString(): string {
      return `@get:{${this.key}}`;
    }
  };

  static Mustache = class extends RuleEvaluator {
    _eval: RuleEvaluator;

    constructor(_eval: RuleEvaluator) {
      super();
      this._eval = _eval;
    }

    getString(context: AnalyzerManager, value: any): string {
      if (this._eval instanceof JsEvaluator.Js) {
        const result = this._eval.eval(context, value);
        if (result === null) {
          return '';
        } else if (typeof result === 'string') {
          return result;
        } else if (typeof result === 'number' && result % 1 === 0) {
          return result.toFixed(0);
        } else {
          return result.toString();
        }
      } else {
        return this._eval.getString(context, value);
      }
    }

    toString(): string {
      return `{{${this._eval}}}`;
    }
  };

  static JsonPath = class extends RuleEvaluator {
    _eval: RuleEvaluator;

    constructor(_eval: RuleEvaluator) {
      super();
      this._eval = _eval;
    }

    getString(context: AnalyzerManager, value: any): string {
      return this._eval.getString(context, value);
    }

    toString(): string {
      return `{${this._eval}}`;
    }
  };

  static Regex = class extends RuleEvaluator {
    index: number;

    constructor(index: number) {
      super();
      this.index = index;
    }

    getString(_context: AnalyzerManager, value: any): string {
      const list = value as string[];
      return list?.[this.index] || `$${this.index}`;
    }

    toString(): string {
      return `$${this.index}`;
    }
  };

  static Literal = class extends RuleEvaluator {
    str: string;

    constructor(str: string) {
      super();
      this.str = str;
    }

    getString(_context: AnalyzerManager, _value: any): string {
      return this.str;
    }

    toString(): string {
      return this.str;
    }
  };
}
