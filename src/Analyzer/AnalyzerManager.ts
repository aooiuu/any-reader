import type { Analyzer } from './Analyzer'
import { AnalyzerHtml } from './AnalyzerHtml'
import { AnalyzerJSonPath } from './AnalyzerJSonPath'
import { AnalyzerJS } from './AnalyzerJS'
import { AnalyzerXPath } from './AnalyzerXPath'

const ruleTypePattern
  = new RegExp([
    '@js:', // @js: code
    '|',
    '@hetu:', // @hetu: code
    '|',
    '@web:', // @web:[(baseUrl|result)@@]script0[\n\s*@@\s*\nscript1]
    '|',
    '@webview:', // @webview:[(baseUrl|result)@@]script0[\n\s*@@\s*\nscript1]
    '|',
    '@css:', // @css:a, @css:a@href, @css:a@text
    '|',
    '@json:', // @json:$.books.*, @json:$.name
    '|',
    '@http:', // @http:, @http:/api/$result
    '|',
    '@xpath:', // @xpath://a, @xpath:/a/@href, @xpath: /a/text()
    '|',
    '@match:', // @match:http.*?jpg， @match:url\("?(.*?jpg)@@1
    '|',
    '@regex:', // @regexp:h3[\s\S]*?h3
    '|',
    '@regexp:', // @regexp:h3[\s\S]*?h3
    '|',
    '@filter:', // @filter:lrc, @filter:m3u8, @filter:mp3
    '|',
    '@replace:', // @replace:</?em>, @replace:(?=\d+)@@播放量
    '|',
    '@encode:', // @encode:utf8|gbk|md5|base64|hmac|sha|sha256|aes
    '|',
    '@decode:', // @decode:utf8|gbk|base64|hmac|sha|sha256|aes
    '|',
    '^'].join(''), 'g')

class SingleRule {
  analyzer: Analyzer
  rule: string

  constructor(analyzer: Analyzer, rule: string) {
    this.analyzer = analyzer
    this.rule = rule
  }
}

export class AnalyzerManager {
  private _content: string

  constructor(content: string) {
    this._content = content
  }

  // 规则从后往前解析
  splitRuleReversed(rule: string) {
    const ruleMath = Array.from(rule.matchAll(ruleTypePattern)).reverse()
    const ruleList: SingleRule[] = []
    let end = rule.length
    for (const m of ruleMath) {
      const start = m.index as number
      const r = rule.substring(start, end)
      end = start as number
      if (r.startsWith('$'))
        ruleList.push(new SingleRule(new AnalyzerJSonPath(), r))
      else if (r.startsWith('@js:'))
        ruleList.push(new SingleRule(new AnalyzerJS(), r.substring(4)))
      else if (r.startsWith('/'))
        ruleList.push(new SingleRule(new AnalyzerXPath(), r.substring(4)))
      else ruleList.push(new SingleRule(new AnalyzerHtml(), r))
    }

    return ruleList.reverse()
  }

  async _getElements(r: SingleRule, rule?: string) {
    return r.analyzer.getElements(rule || r.rule)
  }

  async getElements(rule: string) {
    let temp: string | string [] = this._content

    for (const r of this.splitRuleReversed(rule)) {
      r.analyzer.parse(temp as string)
      temp = await this._getElements(r)
    }

    if (Array.isArray(temp))
      return temp
    else
      return [temp]
  }

  async _getString(r: SingleRule, rule?: string): Promise<string> {
    const res = await r.analyzer.getString(rule || r.rule)
    return Array.isArray(res) ? res.join('').trim() : res
  }

  async getString(rule: string): Promise<string> {
    if (!rule)
      return ''
    const expressionPattern = /\{\{(.*?)\}\}/gd

    const pLeft = rule.lastIndexOf('{{')
    const pRight = rule.lastIndexOf('}}')
    if (pLeft > -1 && pLeft < pRight) {
      let position = 0
      const rs: string[] = []
      for (const match of rule.matchAll(expressionPattern)) {
        rs.push(rule.substring(position, match.index))
        position = (match.index as number) + match[0].length
        rs.push(await this.getString(match[1]))
      }

      if (position < rule.length)
        rs.push(rule.substring(position))

      return rs.join('')
    }

    let temp: string = this._content
    for (const r of this.splitRuleReversed(rule)) {
      r.analyzer.parse(temp as string)
      temp = await this._getString(r)
    }
    return temp
  }

  async getUrl(rule: string, host: string): Promise<string> {
    let url = await this.getString(rule)

    if (url.startsWith('//')) {
      if (host.startsWith('https'))
        url = `https:${url}`

      else
        url = `http:${url}`
    }
    else if (url.startsWith('/')) {
      url = host + url
    }

    return url
  }
}
