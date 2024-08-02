import type { Rule } from '@any-reader/rule-utils'
import type { Analyzer } from './Analyzer'
import { analyzerUrl } from './analyzerUrl'
import { JSEngine } from './JSEngine'

export class AnalyzerWeb implements Analyzer {
  _content!: string

  parse(content: string) {
    this._content = content
  }

  async getString(rule: string): Promise<string> {
    return (await analyzerUrl(rule, '', '', JSEngine.environment.rule as Rule)).body
  }

  getStringList(_: string): Promise<string[]> {
    throw new Error('Method not implemented.')
  }

  getElements(_: string): Promise<string | string[]> {
    throw new Error('Method not implemented.')
  }
}
