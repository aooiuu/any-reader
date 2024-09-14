import { Analyzer } from './Analyzer';

export class AnalyzerJS extends Analyzer {
  _content!: any;

  parse(content: any) {
    this._content = content;
  }

  async getString(rule: string): Promise<string> {
    const val = await this.getElements(rule);
    return Array.isArray(val) ? val.join('  ') : val;
  }

  async getStringList(rule: string): Promise<string[]> {
    return this.getElements(rule) as Promise<string[]>;
  }

  async getElements(rule: string) {
    return await this.JSEngine.evaluate(rule, {
      result: this._content
    });
  }
}
