import type { Analyzer } from './Analyzer'

export class AnalyzerRegExp implements Analyzer {
  _content!: string

  parse(content: string) {
    this._content = content
  }

  async getString(rule: string): Promise<string> {
    const val = this.getElements(rule)
    return Array.isArray(val) ? val.join('  ') : val
  }

  _getResult(): string {
    return ''
  }

  async getStringList(): Promise<string[]> {
    return []
  }

  async getElements(rule: string) {
    return rule
  }
}
