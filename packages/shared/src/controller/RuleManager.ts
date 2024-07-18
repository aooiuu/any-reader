import md5 from 'blueimp-md5'
import { RuleManager as RM } from '@any-reader/core'
import { ContentType } from '@any-reader/rule-utils'
import { Cacheable, Controller, Post } from '../decorators'
import type { BookChapter } from '../utils/book-manager'
import bookManager from '../utils/book-manager'
import { BaseController } from './BaseController'

@Controller('/rule-manager')
export class RuleManager extends BaseController {
  @Post('discover-map')
  async discoverMap(arg: { ruleId: string }) {
    const rule = await this.getRule(arg.ruleId)
    const ruleManager = new RM(rule)
    return await ruleManager.discoverMap()
  }

  @Post('discover')
  async discover(arg: { ruleId: string; data: any }) {
    const rule = await this.getRule(arg.ruleId)
    const ruleManager = new RM(rule)
    return ruleManager.discover(arg.data.value)
  }

  @Post('search-by-rule-id')
  async searchByRuleId(arg: { ruleId: string; keyword: string }) {
    const rule = await this.getRule(arg.ruleId)
    const analyzer = new RM(rule)
    return await analyzer.search(arg.keyword)
  }

  @Post('chapter')
  @Cacheable({
    ttl: 1000 * 60 * 60,
    cacheKey({ args }) {
      const { ruleId = '', filePath = '' } = args[0]
      return `chapter@${ruleId || '__local__'}@${md5(filePath)}`
    },
  })
  async getChapter({ ruleId, filePath }: { ruleId?: string; filePath: string }) {
    if (ruleId) {
      const rule = await this.getRule(ruleId)
      const rm = new RM(rule)
      const list = await rm.getChapter(filePath).catch(() => [])
      return list.map((e: any) => ({
        ...e,
        name: e.name,
        chapterPath: e.url,
      }),
      )
    }
    // 本地
    return bookManager.getChapter(filePath)
  }

  @Post('content')
  @Cacheable({
    cacheKey({ args }) {
      const { filePath = '', chapterPath = '', ruleId = '' } = args[0]
      return `content@${ruleId || '__local__'}@${md5(filePath)}@${md5(chapterPath)}`
    },
  })
  async content({ filePath, chapterPath, ruleId }: any) {
    // 在线
    if (ruleId) {
      const rule = await this.getRule(ruleId)
      const rm = new RM(rule)
      const content: string[] = await rm.getContent(chapterPath).catch(() => [])
      let text = ''
      if (rule.contentType === ContentType.MANGA)
        text = content.map(src => `<img src="${src}"/>`).join('')
      else if (rule.contentType === ContentType.VIDEO)
        text = content?.[0] || ''
      else
        text = content.join('\n')

      return {
        content: text,
      }
    }
    // 本地
    const content = await bookManager.getContent(toBookChapter(filePath, chapterPath))
    return {
      content,
    }
  }

  private async getRule(ruleId: string) {
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
