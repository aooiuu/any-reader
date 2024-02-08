import { load } from 'cheerio'
import type { Analyzer } from './Analyzer'

export class AnalyzerHtml implements Analyzer {
  _content!: string

  parse(content: string | string[]) {
    if (Array.isArray(content))
      this._content = content.join('\n')
    else
      this._content = content
  }

  async getString(rule: string): Promise<string> {
    return (await this.getStringList(rule)).join('  ')
  }

  _getResult(lastRule: string, html?: string): string {
    const $ = load(html || this._content, null, false)

    switch (lastRule) {
      case 'text':
        return $.text() || ''
      case 'textNodes':
        return $.root().children().map((_, el) => $(el).text()).get().join('\n').trim() || ''
      case 'outerHtml':
        return $.html() || ''
      case 'innerHtml':
        return $.root().map((_, el) => $(el).html()).get().join('\n').trim() || ''
      case 'html':
        return $.html() || ''
    }
    if (lastRule)
      return $(html || this._content).attr(lastRule)?.trim() || ''

    return ''
  }

  async getStringList(rule: string): Promise<string[]> {
    if (!rule.includes('@'))
      return [this._getResult(rule)]

    const [selectors, lastRule] = rule.split('@')
    const $ = load(this._content, null, false)
    return $(selectors).map((_, el) => this._getResult(lastRule, $(el).toString())).get()
  }

  async getElements(rule: string) {
    const $ = load(this._content, null, false)
    return $(`${rule.trim()}`).map((_, el) => $(el).toString()).get()
  }
}
