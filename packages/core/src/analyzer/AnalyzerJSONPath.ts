import { JSONPath } from 'jsonpath-plus'
import type { Analyzer } from './Analyzer'

export class AnalyzerJSONPath implements Analyzer {
  _content!: any
  static pattern: RegExp = /^@json:|^\$/i

  parse(content: string | any) {
    if (typeof content === 'string')
      this._content = JSON.parse(content)
    else
      this._content = content
  }

  async getString(rule: string): Promise<string> {
    const val = await this.getElements(rule)
    return Array.isArray(val) ? val.join('  ') : val
  }

  async getStringList(rule: string): Promise<string[]> {
    return this.getElements(rule)
  }

  async getElements(rule: string) {
    const rows = JSONPath({
      path: rule,
      json: this._content,
    })
    if (Array.isArray(rows) && rows.length === 1)
      return rows[0]

    return rows
  }
}
