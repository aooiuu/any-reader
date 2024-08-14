import { RuleEvaluator } from './common';

export class XPathEvaluator extends RuleEvaluator {
  constructor(private xpath: string) {
    super();
  }

  override getStrings(context: AnalyzerManager, value: any): string[] {
    const result = this.getElements(context, value) as JXNode[];
    return result.map((node) => node.asString());
  }

  override getElements(context: AnalyzerManager, value: any): any[] {
    if (!value) return [];
    if (value instanceof JXNode) {
      return value.sel(this.xpath);
    } else if (value instanceof JXDocument) {
      return value.selN(this.xpath);
    }
    return [];
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

    private parse(doc: any): any {
      if (doc instanceof JXNode) {
        return doc.isElement ? doc : this.strToJXDocument(doc.toString());
      } else if (doc instanceof Document) {
        return JXDocument.create(doc);
      } else if (doc instanceof Element) {
        return JXDocument.create(new Elements(doc));
      } else if (doc instanceof Elements) {
        return JXDocument.create(doc);
      } else {
        return this.strToJXDocument(doc.toString());
      }
    }

    private strToJXDocument(html: string): JXDocument {
      let html1 = html;
      if (html1.endsWith('</td>')) {
        html1 = `<tr>${html1}</tr>`;
      }
      if (html1.endsWith('</tr>') || html1.endsWith('</tbody>')) {
        html1 = `<table>${html1}</table>`;
      }

      try {
        if (html1.trim().startsWith('<?xml', true)) {
          return JXDocument.create(Jsoup.parse(html1, Parser.xmlParser()));
        }
      } catch (error) {
        // Handle parsing error if necessary
      }
      return JXDocument.create(html1);
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
