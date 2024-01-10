import { JSONPath } from 'jsonpath-plus'
import type { Analyzer } from './Analyzer'

export class AnalyzerJSonPath implements Analyzer {
  _content!: any

  parse(content: string | any) {
    if (typeof content === 'string')
      this._content = JSON.parse(content)

    else
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
    return JSONPath({
      path: rule,
      json: this._content,
    })
  }
}
