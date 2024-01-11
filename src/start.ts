import type { Rule } from './index'
import { RuleManager } from './index'

const rule = {
  host: '', // 根域名
  searchUrl: '', // 搜索地址
  searchList: '', // 搜索列表
  searchCover: '', // 封面
  searchName: '', // 标题
  searchAuthor: '', // 作者
  searchChapter: '', // 章节
  searchDescription: '', // 描述
  searchResult: '', // 搜索结果
  chapterUrl: '', // 章节地址
  chapterName: '', // 标题
  chapterList: '', // 列表
  chapterCover: '', // 封面
  chapterTime: '', // 时间
  chapterResult: '', // 结果
  contentItems: '', // 内容
}

const analyzer = new RuleManager(rule as unknown as Rule)
const list = await analyzer.search('1')
const chapters = await analyzer.getChapter(list[0].url)
const content = await analyzer.getContent(chapters[0].url)

// eslint-disable-next-line no-console
console.log(content)
