import { ContentType } from '@any-reader/rule-utils'
import type { Rule } from '@any-reader/rule-utils'
import { JSEngine } from './JSEngine'
import type { AnalyzerManager } from './AnalyzerManager'
import { fetch } from './request'

export interface SearchItem {
  name: string
  cover: string
  author: string
  chapter: string
  description: string
  url: string
}

export interface ChapterItem {
  url: string
  name: string
  cover?: string
  contentUrl?: string
  time?: string
}

export class RuleManager {
  private rule: Rule
  private _nextUrl: Map<string, string>
  private analyzerManager: AnalyzerManager

  constructor(rule: Rule, analyzerManager: AnalyzerManager) {
    this.rule = rule
    this._nextUrl = new Map()
    JSEngine.setEnvironment({
      host: this.rule.host,
      $host: this.rule.host,
      cookie: this.rule.cookies,
      rule,
      page: 1,
      $page: 1,
      $pageSize: 20,
      searchPage: 1,
    })
    this.analyzerManager = analyzerManager
  }

  private parseUrl(url: string) {
    if (url.startsWith('@js:'))
      url = JSEngine.evaluate(url.substring(4))
    return url
  }

  async search(keyword: string) {
    const { searchUrl } = this.rule
    JSEngine.setEnvironment({
      $keyword: keyword,
      keyword,
      searchKey: keyword,
    })
    const { body } = await fetch(this.parseUrl(searchUrl), keyword, '', this.rule)
    const list = await this.analyzerManager.getElements(this.rule.searchList, body)

    const result: SearchItem[] = []
    for (const row of list) {
      result.push({
        cover: await this.analyzerManager.getString(this.rule.searchCover, row),
        name: (await this.analyzerManager.getString(this.rule.searchName, row)).trim(),
        author: await this.analyzerManager.getString(this.rule.searchAuthor, row),
        chapter: await this.analyzerManager.getString(this.rule.searchChapter, row),
        description: await this.analyzerManager.getString(this.rule.searchDescription, row),
        url: await this.analyzerManager.getUrl(this.rule.searchResult, this.rule.host, row),
      })
    }

    return result
  }

  async getChapter(result: string): Promise<ChapterItem[]> {
    JSEngine.setEnvironment({
      result,
    })
    if (this.rule.chapterUrl === '正文') {
      return [
        {
          url: result,
          name: this.rule.chapterUrl,
        },
      ]
    }
    const chapterUrl = this.rule.chapterUrl || result
    const { body } = await fetch(this.parseUrl(chapterUrl), '', result, this.rule)

    JSEngine.setEnvironment({
      page: 1,
      lastResult: result,
      result: body,
      baseUrl: chapterUrl,
    })

    let list = []
    if (this.rule.enableMultiRoads) {
      // TODO: 多线路
      const roads = await this.analyzerManager.getElements(this.rule.chapterRoads, body)
      // for (const road of roads) {
      const road = roads[0]
      list = await this.analyzerManager.getElements(this.rule.chapterList, road)
      // }
    }
    else {
      list = await this.analyzerManager.getElements(this.rule.chapterList, body)
    }
    const chapterItems: ChapterItem[] = []
    for (const row of list) {
      chapterItems.push({
        cover: await this.analyzerManager.getString(this.rule.chapterCover, row),
        name: (await this.analyzerManager.getString(this.rule.chapterName, row)).trim(),
        time: await this.analyzerManager.getString(this.rule.chapterTime, row),
        url: await this.analyzerManager.getUrl(this.rule.chapterResult, this.rule.host, row),
      })
    }
    return chapterItems
  }

  async getContent(result: string): Promise<string[]> {
    JSEngine.setEnvironment({
      result,
    })
    const contentUrl = this.rule.contentUrl !== 'null' ? this.rule.contentUrl : null
    const { body, params } = await fetch(this.parseUrl(contentUrl || result), '', result, this.rule)
    JSEngine.setEnvironment({
      page: 1,
      lastResult: result,
      result: body,
      baseUrl: params.url,
    })
    let list = await this.analyzerManager.getStringList(this.rule.contentItems, body)
    if (this.rule.contentType === ContentType.NOVEL) {
      list = list
        .join('\n')
        .replace(/\n+/g, '\n')
        .trim()
        .split('\n')
        .map(e => e.trim())
    }
    return list
  }

  // 获取获取分类
  async discoverMap() {
    const map: DiscoverList[] = []
    const table = new Map()

    let discoverUrl = this.rule.discoverUrl.trimStart()

    if (discoverUrl.startsWith('@js:')) {
      JSEngine.setEnvironment({
        page: 1,
        baseUrl: this.rule.host,
      })
      discoverUrl = JSEngine.evaluate(
          `${discoverUrl.substring(4)};`,
      )
    }

    const discovers = Array.isArray(discoverUrl)
      ? discoverUrl.map(e => e.toString())
      : typeof discoverUrl === 'string'
        ? discoverUrl.split(/[\n\s*]|&&/)
        : []

    for (const url of discovers) {
      if (url.trim().length === 0)
        continue

      const d = url.split('::')
      const ruleValue = d[d.length - 1].trim()
      let tab = '全部'
      let className = '全部'

      if (d.length === 2) {
        tab = d[0].trim()
        className = '全部'
      }
      else if (d.length === 3) {
        tab = d[0].trim()
        className = d[1].trim()
      }

      if (!table.has(tab)) {
        table.set(tab, map.length)
        map.push(
          {
            name: tab,
            pairs: [{
              name: className,
              value: ruleValue,
            }],
          },
        )
      }
      else {
        map[table.get(tab)].pairs.push({
          name: className,
          value: ruleValue,
        },
        )
      }
    }

    if (map.length === 0) {
      if (this.rule.host.startsWith('http')) {
        map.push({
          name: '全部',
          pairs: [
            {
              name: '全部',
              value: this.rule.host,
            },
          ],
        },
        )
      }
      else {
        map.push({
          name: 'example',
          pairs: [{
            name: 'example',
            value: 'http://example.com/',
          }],
        },
        )
      }
    }

    return map
  }

  // 获取分类下内容
  async discover(url: string, page = 1) {
    JSEngine.setEnvironment({
      result: url,
    })
    const hasNextUrlRule
      = this.rule.discoverNextUrl !== undefined
      && this.rule.discoverNextUrl.length > 0
    let discoverRule

    if (page === 1) {
      discoverRule = url
    }
    else if (hasNextUrlRule && page > 1) {
      const next = this._nextUrl.get(url)
      if (next !== undefined && next.length > 0)
        discoverRule = next
    }
    else if (
      /(\$page)|((^|[^a-zA-Z'"_/-])page([^a-zA-Z0-9'"]|$))/.test(url)
    ) {
      discoverRule = url
    }

    if (!discoverRule)
      return []

    const discoverUrl = ''
    let body = ''

    if (discoverRule !== 'null') {
      const { body: res } = await fetch(this.parseUrl(discoverRule), '', '', this.rule)
      body = res
    }

    JSEngine.setEnvironment({
      page: 1,
      lastResult: url,
      result: body,
      baseUrl: this.rule.host,
    })

    if (hasNextUrlRule) {
      this._nextUrl.set(
        url,
        await this.analyzerManager.getString(this.rule.discoverNextUrl as string, body),
      )
    }
    else { this._nextUrl.delete(url) }

    const list = await this.analyzerManager.getElements(this.rule.discoverList, body)
    const result = []

    for (const item of list) {
      const tag = await this.analyzerManager.getString(this.rule.discoverTags, item)

      let tags: string[] = []
      if (tag !== undefined && tag.trim() !== '')
        tags = tag.split(' ').filter(tag => tag !== '')

      result.push({
        searchUrl: discoverUrl,
        cover: await this.analyzerManager.getString(this.rule.discoverCover, item),
        name: await this.analyzerManager.getString(this.rule.discoverName, item),
        author: await this.analyzerManager.getString(this.rule.discoverAuthor, item),
        chapter: await this.analyzerManager.getString(this.rule.discoverChapter, item),
        description: await this.analyzerManager.getString(this.rule.discoverDescription, item),
        url: await this.analyzerManager.getString(this.rule.discoverResult, item),
        tags,
      })
    }

    return result
  }
}

// 分类列表
export interface DiscoverList {
  name: string
  pairs: Discover[]

}

export interface Discover {
  name: string
  value: string
}
