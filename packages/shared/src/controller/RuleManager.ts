import md5 from 'blueimp-md5'
import { analyzerUrl, createAnalyzerManager, createRuleManager } from '@any-reader/core'
import type { Rule } from '@any-reader/rule-utils'
import { ContentType } from '@any-reader/rule-utils'
import { Cacheable, Controller, Post } from '../decorators'
import type { BookChapter } from '../utils/book-manager'
import bookManager from '../utils/book-manager'
import { BaseController } from './BaseController'

@Controller('/rule-manager')
export class RuleManager extends BaseController {
  @Post('discover-map')
  async discoverMap({ ruleId }: { ruleId: string }) {
    const rule = await this.getRule(ruleId)
    return await this.discoverMapByRule({ rule })
  }

  @Post('discover')
  async discover({ ruleId, data }: { ruleId: string; data: any }) {
    const rule = await this.getRule(ruleId)
    return await this.discoverByRule({ rule, data })
  }

  @Post('search-by-rule-id')
  async searchByRuleId({
    ruleId,
    keyword,
  }: {
    ruleId: string
    keyword: string
  }) {
    const rule = await this.getRule(ruleId)
    return await this.searchByRule({ rule, keyword })
  }

  @Post('chapter')
  @Cacheable({
    ttl: 1000 * 60 * 60,
    cacheKey({ args }) {
      const { ruleId = '', filePath = '' } = args[0]
      return `chapter@${ruleId || '__local__'}@${md5(filePath)}`
    },
  })
  async getChapter({
    ruleId,
    filePath,
  }: {
    ruleId?: string
    filePath: string
  }) {
    if (ruleId) {
      const rule = await this.getRule(ruleId)
      return await this.chapterByRule({ rule, filePath })
    }
    // 本地
    return bookManager.getChapter(filePath)
  }

  @Post('content')
  @Cacheable({
    cacheKey({ args }) {
      const { filePath = '', chapterPath = '', ruleId = '' } = args[0]
      return `content@${ruleId || '__local__'}@${md5(filePath)}@v3_${md5(chapterPath)}`
    },
  })
  async content({
    filePath,
    chapterPath,
    ruleId,
  }: {
    ruleId: string
    filePath: string
    chapterPath: string
  }) {
    // 在线
    if (ruleId) {
      const rule = await this.getRule(ruleId)
      return await this.contentByRule({ rule, chapterPath })
    }
    // 本地
    const content = await bookManager.getContent(
      toBookChapter(filePath, chapterPath),
    )
    return {
      content,
    }
  }

  @Post('search-by-rule')
  async searchByRule({ rule, keyword }: { rule: Rule; keyword: string }) {
    const analyzer = createRuleManager(rule)
    return await analyzer.search(keyword)
  }

  @Post('chapter-by-rule')
  async chapterByRule({ rule, filePath }: { rule: Rule; filePath: string }) {
    const rm = createRuleManager(rule)
    const list = await rm.getChapter(filePath)
    return list.map((e: any) => ({
      ...e,
      name: e.name,
      chapterPath: e.url,
    }))
  }

  @Post('content-by-rule')
  async contentByRule({
    chapterPath,
    rule,
  }: {
    rule: Rule
    chapterPath: string
  }) {
    const rm = createRuleManager(rule)
    const content: string[] = await rm.getContent(chapterPath)
    let text: string | string[] = ''
    if (rule.contentType === ContentType.VIDEO)
      text = content?.[0] || ''
    else text = content

    return {
      contentType: rule.contentType,
      content: text,
    }
  }

  @Post('discover-map-by-rule')
  async discoverMapByRule({ rule }: { rule: Rule }) {
    const ruleManager = createRuleManager(rule)
    return await ruleManager.discoverMap()
  }

  @Post('discover-by-rule')
  async discoverByRule({ rule, data }: { rule: Rule; data: any }) {
    const ruleManager = createRuleManager(rule)
    return await ruleManager.discover(data.value)
  }

  @Post('analyzer-text')
  async analyzerText({
    inputText,
    ruleText,
    isArray,
  }: {
    inputText: string
    ruleText: string
    isArray: boolean
  }) {
    return isArray ? await createAnalyzerManager().getElements(ruleText, inputText) : await createAnalyzerManager().getString(ruleText, inputText)
  }

  @Post('analyzer-url')
  async analyzerUrl({
    rule,
    url,
    keyword,
  }: {
    url: string
    rule: Rule
    keyword: string
  }) {
    return await analyzerUrl(url, keyword, '', rule)
  }

  private async getRule(ruleId: string): Promise<Rule> {
    const rule = await this.db.getResourceRule().findById(ruleId)
    if (!rule)
      throw new Error('规则不存在')
    return rule
  }
}

/**
 * 转换为 BookChapter
 * @param filePath 文件路径
 * @param chapterPath 章节路径
 * @returns
 */
function toBookChapter(filePath: string, chapterPath: string): BookChapter {
  return {
    name: '',
    chapterPath,
    filePath,
  }
}
