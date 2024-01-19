import type { Analyzer } from './Analyzer'

export class AnalyzerRegExp implements Analyzer {
  _content!: string

  parse(content: string) {
    this._content = content
  }

  getString(rule: string): string {
    const val = this.getElements(rule)
    return Array.isArray(val) ? val.join('  ') : val
  }

  _getResult(): string {
    return ''
  }

  getStringList(): string[] {
    return []
  }

  getElements(rule: string) {
    return rule
  }
}
