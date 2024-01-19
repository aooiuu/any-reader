import { JSONPath } from 'jsonpath-plus'
import type { Analyzer } from './Analyzer'

export class AnalyzerJSONPath implements Analyzer {
  _content!: any

  parse(content: string | any) {
    if (typeof content === 'string')
      this._content = JSON.parse(content)
    else
      this._content = content
  }

  getString(rule: string): string {
    const val = this.getElements(rule)
    return Array.isArray(val) ? val.join('  ') : val
  }

  getStringList(rule: string): string[] {
    return this.getElements(rule)
  }

  getElements(rule: string) {
    return JSONPath({
      path: rule,
      json: this._content,
    })
  }
}
