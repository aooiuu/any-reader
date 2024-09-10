import xpath from 'xpath';
import { DOMParser, MIME_TYPE } from '@xmldom/xmldom';
import { AnalyzerManager } from './AnalyzerManager';
import { RuleEvaluator } from './common';

class JXDocument {
  static create(content: string) {
    return new JXNode(content);
  }
}

class JXNode {
  private _content: string;
  constructor(content: string) {
    this._content = content;
  }

  sel(rule: string) {
    const doc = new DOMParser().parseFromString(this._content, MIME_TYPE.HTML);
    const node: any[] = xpath.parse(rule).select({ node: doc, isHtml: true });
    return node.map((e) => e.toString());
  }
}

export class XPathEvaluator extends RuleEvaluator {
  constructor(private xpath: string) {
    super();
  }

  override getStrings(context: AnalyzerManager, value: any): string[] {
    const result = this.getElements(context, value);
    return result;
  }

  override getElements(context: AnalyzerManager, value: any): any[] {
    if (!value) return [];
    return value.sel(this.xpath);
  }

  override getElement(context: AnalyzerManager, value: any): any {
    return this.getElements(context, value);
  }

  override toString(): string {
    return this.xpath;
  }

  static ConvertWrapper = class extends RuleEvaluator {
    constructor(private _eval: RuleEvaluator) {
      super();
    }

    private parse(doc: string): any {
      return JXDocument.create(doc);
    }

    override getStrings(context: AnalyzerManager, value: any): string[] | null {
      if (!value) return null;
      return this._eval.getStrings(context, this.parse(value));
    }

    override getElements(context: AnalyzerManager, value: any): any[] {
      if (!value) return [];
      return this._eval.getElements(context, this.parse(value));
    }
  };
}
