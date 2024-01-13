import type { Analyzer } from './Analyzer'
import { AnalyzerHtml } from './AnalyzerHtml'
import { AnalyzerJSONPath } from './AnalyzerJSONPath'
import { AnalyzerXPath } from './AnalyzerXPath'
import { AnalyzerRegExp } from './AnalyzerRegExp'
import { AnalyzerJS } from './AnalyzerJS'

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
  replace: string

  constructor(analyzer: Analyzer, rule: string, replace = '') {
    this.analyzer = analyzer
    this.rule = rule
    this.replace = replace
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
      let analyzer: Analyzer = new AnalyzerHtml()
      const start = m.index as number
      let r = rule.substring(start, end)
      end = start as number

      switch (r[0]) {
        case '$':
          analyzer = new AnalyzerJSONPath()
          break
        case '@': {
          if (r.startsWith('@js:')) {
            r = r.substring(4)
            analyzer = new AnalyzerJS()
          }
          // else if (r.startsWith("@hetu:")) {
          //   r = r.substring(6);
          //   analyzer = new AnalyzerHetu();
          // }
          else if (r.startsWith('@css:')) {
            r = r.substring(5)
            analyzer = new AnalyzerHtml()
          }
          else if (r.startsWith('@json:')) {
            r = r.substring(6)
            analyzer = new AnalyzerJSONPath()
          }
          else if (r.startsWith('@xpath:')) {
            r = r.substring(7)
            analyzer = new AnalyzerXPath()
          }
          // else if (r.startsWith("@match:")) {
          //   r = r.substring(7);
          //   analyzer = new AnalyzerMatch();
          // }
          else if (r.startsWith('@regex:')) {
            r = r.substring(7)
            analyzer = new AnalyzerRegExp()
          }
          else if (r.startsWith('@regexp:')) {
            r = r.substring(8)
            analyzer = new AnalyzerRegExp()
          }
          // else if (r.startsWith("@filter:")) {
          //   r = r.substring(8);
          //   analyzer = new AnalyzerFilter();
          // } else if (r.startsWith("@replace:")) {
          //   r = r.substring(9);
          //   analyzer = new AnalyzerReplace();
          // } else if (r.startsWith("@webview:")) {
          //   r = r.substring(9);
          //   analyzer = new AnalyzerWebview();
          // } else if (r.startsWith("@web:")) {
          //   r = r.substring(5);
          //   analyzer = new AnalyzerWebview();
          // }
          break
        }
        case ':':
          r = r.substring(1)
          analyzer = new AnalyzerRegExp()
          break
        case '/':
          analyzer = new AnalyzerXPath()
          break
        default:
          analyzer = new AnalyzerHtml()
      }

      const position = r.indexOf('##')
      if (position > -1) {
        ruleList.push(
          new SingleRule(analyzer, r.substring(0, position), r.substring(position + 2)))
      }
      else {
        ruleList.push(new SingleRule(analyzer, r, ''))
      }
    }
    return ruleList.reverse()
  }

  _getElements(r: SingleRule, rule?: string) {
    return r.analyzer.getElements(rule || r.rule)
  }

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

  getElements(rule: string) {
    let temp: string | string [] = this._content

    for (const r of this.splitRuleReversed(rule)) {
      r.analyzer.parse(temp as string)
      temp = this._getElements(r)
    }

    if (Array.isArray(temp))
      return temp
    else
      return [temp]
  }

  _getString(r: SingleRule, rule?: string): string {
    const res = r.analyzer.getString(rule || r.rule)
    return Array.isArray(res) ? res.join('').trim() : res
  }

  getString(rule: string): string {
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
        rs.push(this.getString(match[1]))
      }

      if (position < rule.length)
        rs.push(rule.substring(position))

      return rs.join('')
    }

    let temp: string = this._content
    for (const r of this.splitRuleReversed(rule)) {
      r.analyzer.parse(temp as string)
      temp = this._getString(r)

      if (r.replace)
        temp = this.replaceSmart(r.replace)(temp)
    }
    return temp
  }

  async getUrl(rule: string, host: string): Promise<string> {
    let url = this.getString(rule)

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
