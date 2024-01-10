import type { Analyzer } from './Analyzer'
import { AnalyzerHtml } from './AnalyzerHtml'
import { AnalyzerJSonPath } from './AnalyzerJSonPath'
import { AnalyzerJS } from './AnalyzerJS'
import { AnalyzerXPath } from './AnalyzerXPath'

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
    const ruleList: SingleRule[] = []

    // 分割规则

    if (rule.startsWith('$'))
      ruleList.push(new SingleRule(new AnalyzerJSonPath(), rule))
    else if (rule.startsWith('@js:'))
      ruleList.push(new SingleRule(new AnalyzerJS(), rule.substring(4)))
    else if (rule.startsWith('/'))
      ruleList.push(new SingleRule(new AnalyzerXPath(), rule.substring(4)))
    else ruleList.push(new SingleRule(new AnalyzerHtml(), rule))
    return ruleList
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
    return (await r.analyzer.getString(rule || r.rule)).join('').trim()
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
