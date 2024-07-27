import type { LegadoRule } from '../types'

abstract class RuleManager {
  rule: LegadoRule
  constructor(rule: LegadoRule) {
    this.rule = rule
  }
  // 搜索
  abstract search(keyword: string): Promise<unknown[]>
  // 获取章节
  abstract getChapter(rule: string): Promise<unknown[]>
  // 获取内容
  abstract getContent(rule: string): Promise<string[]>
}

export class LegadoRuleManager implements RuleManager {
  rule: LegadoRule

  constructor(rule: LegadoRule) {
    this.rule = rule
  }

  async search(keyword: string): Promise<unknown[]> {
    return [keyword]
  }

  async getChapter(result: string): Promise<unknown[]> {
    return [result]
  }

  async getContent(result: string): Promise<string[]> {
    return [result]
  }
}
