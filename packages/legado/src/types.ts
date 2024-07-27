interface RuleBookInfo {
  name: string
  author: string
  intro: string
  lastChapter: string
  coverUrl: string
  tocUrl: string
}

interface RuleContent {
  content: string
}

interface RuleSearch {
  bookList: string
  name: string
  author: string
  kind: string
  lastChapter: string
  bookUrl: string
}

interface RuleToc {
  chapterList: string
  chapterName: string
  chapterUrl: string
}

/**
 * 规则类型
 */
enum BookType {
  text = 0,
  audio = 1,
  image = 2,
  file = 3,
}

export interface LegadoRule {
  bookSourceType: BookType
  bookSourceUrl: string
  bookSourceName: string
  bookSourceGroup: string
  customOrder: number
  enabled: boolean
  enabledExplore: boolean
  enabledCookieJar: boolean
  bookSourceComment: string
  lastUpdateTime: number
  respondTime: number
  weight: number
  exploreUrl: string
  ruleExplore: any
  searchUrl: string
  ruleSearch: RuleSearch
  ruleBookInfo: RuleBookInfo
  ruleToc: RuleToc
  ruleContent: RuleContent
  key: string
  searchRule: RuleSearch
  bookInfoRule: RuleBookInfo
  tocRule: RuleToc
  exploreRule: any
  contentRule: RuleContent
  tag: string
}
