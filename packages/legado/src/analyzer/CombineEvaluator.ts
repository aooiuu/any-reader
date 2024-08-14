import { AnalyzerManager } from './AnalyzerManager';
import { RuleEvaluator } from './common';

export class CombineEvaluator {
  static And = class extends RuleEvaluator {
    private evals: RuleEvaluator[];

    constructor(evals: RuleEvaluator[]) {
      super();
      this.evals = evals;
    }

    getStrings(context: AnalyzerManager, value: any): string[] {
      const result: string[] = [];
      for (const _eval of this.evals) {
        const strings = _eval.getStrings(context, value);
        if (strings) {
          result.push(...strings);
        }
      }
      return result;
    }

    getElements(context: AnalyzerManager, value: any): any[] {
      const result: any[] = [];
      for (const _eval of this.evals) {
        const elements = _eval.getElements(context, value);
        result.push(...elements);
      }
      return result;
    }

    getElement(context: AnalyzerManager, value: any): any {
      return this.getElements(context, value);
    }

    toString(): string {
      return this.evals.map((_eval) => _eval.toString()).join('&&');
    }
  };

  static Or = class extends RuleEvaluator {
    private evals: RuleEvaluator[];

    constructor(evals: RuleEvaluator[]) {
      super();
      this.evals = evals;
    }

    getStrings(context: AnalyzerManager, value: any): string[] | null {
      for (const _eval of this.evals) {
        const result = _eval.getStrings(context, value);
        if (result && result.length > 0) {
          return result;
        }
      }
      return null;
    }

    getElements(context: AnalyzerManager, value: any): any[] {
      for (const _eval of this.evals) {
        const result = _eval.getElements(context, value);
        if (result.length > 0) {
          return result;
        }
      }
      return [];
    }

    getElement(context: AnalyzerManager, value: any): any {
      return this.getElements(context, value);
    }

    toString(): string {
      return this.evals.map((_eval) => _eval.toString()).join('||');
    }
  };

  static Transpose = class extends RuleEvaluator {
    private evals: RuleEvaluator[];

    constructor(evals: RuleEvaluator[]) {
      super();
      this.evals = evals;
    }

    getStrings(context: AnalyzerManager, value: any): string[] {
      const arrays: string[][] = [];
      for (const _eval of this.evals) {
        const strings = _eval.getStrings(context, value);
        if (strings) {
          arrays.push(strings);
        }
      }
      const result: string[] = [];
      for (let i = 0; i < arrays[0].length; i++) {
        for (const array of arrays) {
          if (i < array.length) {
            result.push(array[i]);
          }
        }
      }
      return result;
    }

    getElements(context: AnalyzerManager, value: any): any[] {
      const arrays: any[][] = [];
      for (const _eval of this.evals) {
        arrays.push(_eval.getElements(context, value));
      }
      const result: any[] = [];
      for (let i = 0; i < arrays[0].length; i++) {
        for (const array of arrays) {
          if (i < array.length) {
            result.push(array[i]);
          }
        }
      }
      return result;
    }

    getElement(context: AnalyzerManager, value: any): any {
      return this.getElements(context, value);
    }

    toString(): string {
      return this.evals.map((_eval) => _eval.toString()).join('%%');
    }
  };
}
