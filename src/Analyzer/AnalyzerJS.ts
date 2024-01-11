import type { Analyzer } from './Analyzer'

export class AnalyzerJS implements Analyzer {
  _content!: string

  parse(content: string) {
    this._content = content
  }

  getString(rule: string): Promise<string[]> {
    return this.getStringList(rule)
  }

  _getResult(rule: string): string {
    return this.getElements(rule)
  }

  async getStringList(rule: string): Promise<string[]> {
    return this.getElements(rule)
  }

  getElements(rule: string) {
    const environment = `
    let page = "";
    let host = "";
    let cookie = "";
    let result = "";
    let baseUrl = "";
    let keyword = "";
    let lastResult = "";
    `
    // eslint-disable-next-line no-eval
    return eval(`${environment}  result = \`${this._content}\`; ${rule};`)
  }
}
