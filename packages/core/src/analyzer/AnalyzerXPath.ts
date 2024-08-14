import xpath from 'xpath.js';
import { DOMParser } from 'xmldom';
import type { Analyzer } from './Analyzer';

export class AnalyzerXPath implements Analyzer {
  _content!: string;

  parse(content: string | string[]) {
    if (Array.isArray(content)) this._content = content.join('\n');
    else this._content = content;
  }

  async getString(rule: string): Promise<string> {
    const val = await this.getElements(rule);
    return Array.isArray(val) ? val.join('  ') : val;
  }

  async getStringList(rule: string): Promise<string[]> {
    return this.getElements(rule);
  }

  async getElements(rule: string): Promise<string[]> {
    const doc = new DOMParser().parseFromString(this._content);
    const node: any[] = xpath(doc, rule);
    return node.map((e) => (typeof e.value === 'undefined' ? e.toString() : e.value));
  }
}
