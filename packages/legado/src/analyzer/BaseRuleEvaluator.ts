import { AnalyzerManager } from './AnalyzerManager';

export class BaseRuleEvaluator {
  private getClassName() {
    return this.constructor.name;
  }

  getString(_context: AnalyzerManager, _value: any): string {
    throw new Error(`${this.getClassName()} 类没有实现 getString`);
  }

  getElement(_context: AnalyzerManager, _value: any): any | null {
    throw new Error(`${this.getClassName()} 类没有实现 getElement`);
  }

  getString0(_context: AnalyzerManager, _value: any): string {
    throw new Error(`${this.getClassName()} 类没有实现 getString0`);
  }

  getStrings(_context: AnalyzerManager, _value: any): string[] | null {
    throw new Error(`${this.getClassName()} 类没有实现 getStrings`);
  }

  getElements(_context: AnalyzerManager, _value: any): any[] {
    throw new Error(`${this.getClassName()} 类没有实现 getElements`);
  }

  eval(_context: AnalyzerManager, _value: any): any | null {
    throw new Error(`${this.getClassName()} 类没有实现 eval`);
  }
}
