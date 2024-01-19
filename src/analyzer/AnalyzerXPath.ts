import xpath from 'xpath.js'
import { DOMParser } from 'xmldom'
import type { Analyzer } from './Analyzer'

export class AnalyzerXPath implements Analyzer {
  _content!: string

  parse(content: string) {
    this._content = content
  }

  getString(rule: string): string {
    const val = this.getElements(rule)
    return Array.isArray(val) ? val.join('  ') : val
  }

  getStringList(rule: string): any[] {
    return this.getElements(rule)
  }

  getElements(rule: string): any[] {
    try {
      const doc = new DOMParser().parseFromString(this._content)
      const node: any[] = xpath(doc, rule)
      return node.map(e =>
        typeof e.value === 'undefined' ? e.toString() : e.value,
      )
    }
    catch (_) {
      return []
    }
  }
}
