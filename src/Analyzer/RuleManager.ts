import axios from 'axios'
import { AnalyzerManager } from './AnalyzerManager'

const http = axios.create()

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
    url = url.trim().replace('$keyword', keyword).replace('$result', result).replace('$page', '1')

    const host = this.rule.host.trim()
    if (url.startsWith('//')) {
      if (host.startsWith('https'))
        url = `https:${url}`
      else
        url = `http:${url}`
    }
    else if (!url.startsWith('http') && !url.startsWith('ftp')) {
      url = host + url
    }

    const headers = {
      'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.50',
    }

    return await http({
      headers,
      url,
    }).then((e) => {
      return typeof e.data === 'object' ? JSON.stringify(e.data) : e.data
    })
  }

  async search(keyword: string) {
    const body = await this.fetch(this.rule.searchUrl, keyword)
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
    const body = await this.fetch(this.rule.chapterUrl || url, '', url)
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

  async getContent(url: string) {
    const body = await this.fetch(url)
    const bodyAnalyzer = new AnalyzerManager(body)
    const list = await bodyAnalyzer.getString(this.rule.contentItems)

    return list
  }
}
