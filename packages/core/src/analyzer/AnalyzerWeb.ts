import type { Rule } from '@any-reader/rule-utils';
import { Analyzer } from './Analyzer';
import { analyzerUrl } from './analyzerUrl';

export class AnalyzerWeb extends Analyzer {
  _content!: string;

  parse(content: string) {
    this._content = content;
  }

  async getString(rule: string): Promise<string> {
    return (await analyzerUrl(rule, '', '', this.JSEngine.environment.rule as Rule)).body;
  }

  getStringList(_: string): Promise<string[]> {
    throw new Error('Method not implemented.');
  }

  getElements(_: string): Promise<string | string[]> {
    throw new Error('Method not implemented.');
  }
}
