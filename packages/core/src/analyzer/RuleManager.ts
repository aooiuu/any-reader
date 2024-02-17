import axios from 'axios'
import { JSEngine } from './JSEngine'
import { AnalyzerManager } from './AnalyzerManager'

export enum ContentType {
  MANGA = 0,
  NOVEL = 1,
  VIDEO = 2,
  AUDIO = 3,
  RSS = 4,
  NOVELMORE = 5,

  GAME = 101,
}

export const CONTENT_TYPE_TEXT: {
  [k: number]: string
} = {
  0: '漫画',
  1: '小说',
  2: '视频',
  3: '音频',
  4: 'RSS',
  5: '图文',
  101: '游戏',
}

export interface Rule {
  searchUrl: string // 搜索地址
  host: string // 根域名
  searchList: string // 搜索列表
  searchCover: string // 封面
  searchName: string // 标题
  searchAuthor: string // 作者
  searchChapter: string // 章节
  searchDescription: string // 描述
  searchResult: string // 搜索结果
  chapterUrl: string // 章节地址
  chapterName: string // 标题
  chapterList: string // 列表
  chapterCover: string // 封面
  chapterTime: string // 时间
  chapterResult: string // 结果
  contentItems: string // 内容

  id: string // uuid
  name: string // 书源名称
  sort: number // 书源排序
  contentType: ContentType // 书源类型

  cookies?: string
  enableSearch?: boolean // 启用搜索

  // 发现
  'enableDiscover': boolean
  'discoverUrl': string
  'discoverNextUrl'?: string
  'discoverItems': string
  'discoverList': string
  'discoverTags': string
  'discoverName': string
  'discoverCover': string
  'discoverAuthor': string
  'discoverChapter': string
  'discoverDescription': string
  'discoverResult': string
}

export interface SearchItem {
  cover: string
  name: string
  author: string
  chapter: string
  description: string
  url: string
}

export interface ChapterItem {
  url: string
  name: string
  contentUrl?: string
  cover?: string
  time?: string
}

const http = axios.create()

export class RuleManager {
  rule: Rule

  constructor(rule: Rule) {
    this.rule = rule
  }

  /**
   *
   * @param url
   * @param keyword
   * @param result
   * @returns
   */
  async fetch(url: string, keyword = '', result = '') {
    const vars: any = {
      $keyword: keyword,
      searchKey: keyword,
      $host: this.rule.host,
      $result: result,
      searchPage: 1,
      $page: 1,
      $pageSize: 20,
    }

    let params: any = {
      method: 'get',
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.50',
      },
      url,
    }

    // TODO: 编码 encoding
    if (params.url.startsWith('@js:')) {
      params = JSEngine.evaluate(url.substring(4), {
        ...vars,
        keyword,
      })
    }
    else {
      params.url = params.url.replace(
        /\$keyword|\$page|\$host|\$result|\$pageSize|searchKey|searchPage/g,
        (m: string | number) => vars[m] || '',
      )
      if (params.url.startsWith('{'))
        Object.assign(params, JSON.parse(params.url))

      const host = this.rule.host.trim()
      if (params.url.startsWith('//')) {
        if (host.startsWith('https'))
          params.url = `https:${params.url}`
        else params.url = `http:${params.url}`
      }
      else if (
        !params.url.startsWith('http')
        && !params.url.startsWith('ftp')
      ) {
        params.url = host + params.url
      }

      if (params.method === 'post' && typeof params.body === 'object') {
        Object.assign(params, {
          body: undefined,
          data: params.body,
        })
      }
    }

    const body = await http(params)
      .then((e) => {
        return typeof e.data === 'object' ? JSON.stringify(e.data) : e.data
      })
      .catch(() => {})

    return {
      params,
      body,
    }
  }

  async search(keyword: string) {
    const { body } = await this.fetch(this.rule.searchUrl, keyword)
    const bodyAnalyzer = new AnalyzerManager(body)
    const list = await bodyAnalyzer.getElements(this.rule.searchList)

    const result: SearchItem[] = []
    for (const row of list) {
      const analyzer = new AnalyzerManager(row)

      result.push({
        cover: await analyzer.getString(this.rule.searchCover),
        name: (await analyzer.getString(this.rule.searchName)).trim(),
        author: await analyzer.getString(this.rule.searchAuthor),
        chapter: await analyzer.getString(this.rule.searchChapter),
        description: await analyzer.getString(this.rule.searchDescription),
        url: await analyzer.getUrl(this.rule.searchResult, this.rule.host),
      })
    }

    return result
  }

  async getChapter(result: string): Promise<ChapterItem[]> {
    if (this.rule.chapterUrl === '正文') {
      return [
        {
          url: result,
          name: this.rule.chapterUrl,
        },
      ]
    }
    const chapterUrl = this.rule.chapterUrl || result
    const { body } = await this.fetch(chapterUrl, '', result)

    JSEngine.setEnvironment({
      page: 1,
      rule: this.rule,
      result: '',
      baseUrl: chapterUrl,
      keyword: '',
      lastResult: result,
    })
    const bodyAnalyzer = new AnalyzerManager(body)
    const list = await bodyAnalyzer.getElements(this.rule.chapterList)
    const chapterItems: ChapterItem[] = []
    for (const row of list) {
      const analyzer = new AnalyzerManager(row)
      chapterItems.push({
        cover: await analyzer.getString(this.rule.chapterCover),
        name: (await analyzer.getString(this.rule.chapterName)).trim(),
        time: await analyzer.getString(this.rule.chapterTime),
        url: await analyzer.getUrl(this.rule.chapterResult, this.rule.host),
      })
    }
    return chapterItems
  }

  async getContent(result: string, lastResult?: string): Promise<string[]> {
    if (lastResult) {
      JSEngine.setEnvironment({
        page: 1,
        rule: this.rule,
        result: lastResult,
        baseUrl: '',
        keyword: '',
        lastResult,
      })
    }
    const { body, params } = await this.fetch(result)
    JSEngine.setEnvironment({
      page: 1,
      rule: this.rule,
      result: '',
      baseUrl: params.url,
      keyword: '',
      lastResult: result,
    })
    const bodyAnalyzer = new AnalyzerManager(body)
    const list = await bodyAnalyzer.getStringList(this.rule.contentItems)
    return list
  }

  async discoverMap() {
    const map = []
    const table = new Map()

    let discoverUrl = this.rule.discoverUrl.trimStart()

    try {
      if (discoverUrl.startsWith('@js:')) {
        await JSEngine.setEnvironment({
          page: 1,
          rule: this.rule,
          result: '',
          baseUrl: this.rule.host,
          keyword: '',
          lastResult: '',
        })
        discoverUrl = await JSEngine.evaluate(`${discoverUrl.substring(4)};`)
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
          map.push(new DiscoverMap(tab, [
            new DiscoverPair(className, ruleValue),
          ]))
        }
        else {
          map[table.get(tab)].pairs.push(new DiscoverPair(className, ruleValue))
        }
      }
    }
    catch (error) {}

    if (map.length === 0) {
      if (this.rule.host.startsWith('http')) {
        map.push(new DiscoverMap('全部', [
          new DiscoverPair('全部', this.rule.host),
        ]))
      }
      else {
        map.push(new DiscoverMap('example', [
          new DiscoverPair('example', 'http://example.com/'),
        ]))
      }
    }

    return map
  }
}

class DiscoverMap {
  name: string
  pairs: DiscoverPair[]

  constructor(name: string, pairs: DiscoverPair[]) {
    this.name = name
    this.pairs = pairs
  }
}

class DiscoverPair {
  name: string
  value: string

  constructor(name: string, value: string) {
    this.name = name
    this.value = value
  }
}
