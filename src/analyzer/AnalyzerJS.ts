import { runjs } from '../utils/runjs'
import type { Analyzer } from './Analyzer'

export class AnalyzerJS implements Analyzer {
  _content!: string

  parse(content: string) {
    this._content = content
  }

  getString(rule: string): string[] {
    return this.getStringList(rule)
  }

  _getResult(rule: string): string {
    return this.getElements(rule)
  }

  getStringList(rule: string): string[] {
    return this.getElements(rule)
  }

  getElements(rule: string) {
    return runjs(rule, {
      page: '',
      host: '',
      cookie: '',
      result: this._content,
      baseUrl: '',
      keyword: '',
      lastResult: '',
    })
  }
}
