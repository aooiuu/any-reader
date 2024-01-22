import type { Analyzer } from './Analyzer'

export class AnalyzerReplace implements Analyzer {
  private _content!: string
  private _url!: string

  replaceSmart(replace: string) {
    function _replacement(pattern: string) {
      return (...match: string[]) => pattern.replace(/\$(\d+)/, (...m: string[]) => match[+m[1]])
    }

    if (!replace)
      return (s: string) => s

    const r = replace.split('##')
    const match = RegExp(r[0], 'g')
    if (r.length === 1) {
      return (s: string) => s.replaceAll(match, '')
    }
    else {
      const pattern = r[1]
      if (pattern.includes('\$')) {
        if (r.length === 2)
          return (s: string) => s.replace(match, _replacement(pattern))

        else
          return (s: string) => s.replace(match, _replacement(pattern))
      }
      else {
        if (r.length === 2)
          return (s: string) => s.replaceAll(match, pattern)

        else
          return (s: string) => s.replace(match, pattern)
      }
    }
  }

  parse(content: string | string[]) {
    if (Array.isArray(content))
      this._content = content.join('\n')
    else
      this._content = content

    this._url = this._content
  }

  async getString(rule: string): Promise<string> {
    return this.replaceSmart(rule)(this._content)
  }

  async getStringList(rule: string): Promise<string[]> {
    return [await this.getString(rule)]
  }

  async getElements(rule: string): Promise<string> {
    return this.getString(rule)
  }
}
