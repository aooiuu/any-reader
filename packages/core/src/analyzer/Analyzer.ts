import type { JSEngine } from '../sandbox/JSEngine';

export abstract class IAnalyzer {
  abstract parse(content: string): void;
  abstract getString(rule: string): Promise<string>;
  abstract getStringList(rule: string): Promise<string[]>;
  abstract getElements(rule: string): Promise<string | string[]>;
}

export class Analyzer implements IAnalyzer {
  JSEngine: typeof JSEngine;

  constructor(options: { JSEngine: typeof JSEngine }) {
    this.JSEngine = options.JSEngine;
  }

  parse(_: string): void {
    throw new Error('Method not implemented.');
  }

  getString(_: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  getStringList(_: string): Promise<string[]> {
    throw new Error('Method not implemented.');
  }

  getElements(_: string): Promise<string | string[]> {
    throw new Error('Method not implemented.');
  }
}
