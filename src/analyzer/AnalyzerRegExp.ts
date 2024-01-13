import type { Analyzer } from './Analyzer'

export class AnalyzerRegExp implements Analyzer {
  _content!: string

  parse(content: string) {
    this._content = content
  }

  getString(): string[] {
    return this.getStringList()
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
