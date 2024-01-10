import type { Analyzer } from './Analyzer'

export class AnalyzerXPath implements Analyzer {
  _content!: string

  parse(content: string) {
    this._content = content
  }

  getString(): Promise<string[]> {
    return this.getStringList()
  }

  _getResult(): string {
    return ''
  }

  async getStringList(): Promise<string[]> {
    return []
  }

  getElements(rule: string) {
    return rule
  }
}
