import type { Analyzer } from './Analyzer'

export class AnalyzerJS implements Analyzer {
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
    const environment = `
    var page = "";
    var host = "";
    var cookie = "";
    var result = "";
    var baseUrl = "";
    var keyword = "";
    var lastResult = "";
    `
    // eslint-disable-next-line no-eval
    return eval(`${environment} var result = ${this._content}; ${rule};`)
  }
}
