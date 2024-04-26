import { JSEngine } from './JSEngine'
import type { Analyzer } from './Analyzer'

export class AnalyzerJS implements Analyzer {
  _content!: string

  parse(content: string | string[]) {
    if (Array.isArray(content))
      this._content = content.join('\n')
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
    return JSEngine.evaluate(rule, {
      result: this._content,
    }).catch(() => [])
  }
}
