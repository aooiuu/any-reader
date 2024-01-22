import axios from 'axios'
import { JSEngine } from './JSEngine'
import { AnalyzerManager } from './AnalyzerManager'

const http = axios.create()

export enum ContentType {
  MANGA = 0,
  NOVEL = 1,
  VIDEO = 2,
  AUDIO = 3,
  RSS = 4,
  NOVELMORE = 5,
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

    const body = await http(params).then((e) => {
      return typeof e.data === 'object' ? JSON.stringify(e.data) : e.data
    }).catch(() => { })

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

  async getChapter(url: string): Promise<ChapterItem[]> {
    if (this.rule.chapterUrl === '正文') {
      return [{
        url,
        name: this.rule.chapterUrl,
      }]
    }
    const chapterUrl = this.rule.chapterUrl || url
    const { body } = await this.fetch(chapterUrl, '', url)
    JSEngine.setEnvironment({
      page: 1,
      rule: this.rule,
      result: '',
      baseUrl: chapterUrl,
      keyword: '',
      lastResult: url,
    })
    const bodyAnalyzer = new AnalyzerManager(body)
    const list = await bodyAnalyzer.getElements(this.rule.chapterList)
    const result: ChapterItem[] = []
    for (const row of list) {
      const analyzer = new AnalyzerManager(row)
      result.push({
        cover: await analyzer.getString(this.rule.chapterCover),
        name: (await analyzer.getString(this.rule.chapterName)).trim(),
        time: await analyzer.getString(this.rule.chapterTime),
        url: await analyzer.getUrl(this.rule.chapterResult, this.rule.host),
      })
    }
    return result
  }

  async getContent(url: string): Promise<string[]> {
    const { body, params } = await this.fetch(url)
    JSEngine.setEnvironment({
      page: 1,
      rule: this.rule,
      result: '',
      baseUrl: params.url,
      keyword: '',
      lastResult: url,
    })
    const bodyAnalyzer = new AnalyzerManager(body)
    const list = await bodyAnalyzer.getStringList(this.rule.contentItems)
    return list
  }
}
