import { v4 as uuidV4 } from 'uuid'

export enum ContentType {
  MANGA = 0,
  NOVEL = 1,
  VIDEO = 2,
  AUDIO = 3,
  RSS = 4,
  NOVELMORE = 5,

  GAME = 101,
}

export interface Rule {
  host: string // 域名
  id: string // uuid
  name: string // 书源名称
  sort: number // 书源排序
  contentType: ContentType // 书源类型
  cookies?: string
  loadJs?: string // 全局JS脚本
  author: string // 规则作者

  // 搜索
  enableSearch?: boolean // 搜索 - 启用
  searchUrl: string // 搜索 - 地址
  searchList: string // 搜索 - 列表
  searchCover: string // 搜索 - 封面
  searchName: string // 搜索 - 标题
  searchAuthor: string // 搜索 - 作者
  searchChapter: string // 搜索 - 章节
  searchDescription: string // 搜索 - 描述
  searchResult: string // 搜索 - 结果

  // 章节列表
  chapterUrl: string // 章节列表 - 请求地址
  chapterName: string // 章节列表 - 标题
  chapterList: string // 章节列表 - 列表
  chapterCover: string // 章节列表 - 封面
  chapterTime: string // 章节列表 - 时间
  chapterResult: string // 章节列表 - 结果

  contentItems: string // 章节列表 - 内容

  // 发现
  enableDiscover: boolean // 发现页 - 是否启用
  discoverUrl: string // 发现页 - 请求地址
  discoverList: string // 发现页 - 列表
  discoverName: string // 发现页 - 标题
  discoverCover: string // 发现页 - 封面
  discoverAuthor: string // 发现页 - 作者
  discoverDescription: string // 发现页 - 描述
  discoverResult: string // 发现页 - 结果
  discoverItems: string
  discoverTags: string
  discoverChapter: string
  discoverNextUrl?: string

  // 线路
  enableMultiRoads: boolean // 启用多线路
  chapterRoads: string // 线路列表

  // 几种形式
  // 1.纯文本：
  //  如: "userAgent": "Mozilla/5.0 xxx"
  // 2.JSON文本
  //  如: "userAgent": "{\"User-Agent\":\"Mozilla/5.0 xxx\",\"Cookie\":\"token=123;\"}"
  // 3.JSON对象
  //  如: "userAgent": {Cookie: ""}
  userAgent?: string // Headers JSON字符串

  createTime?: number
  modifiedTime?: number

  enableUpload?: boolean
  icon?: string
  group?: string
  useCryptoJS?: boolean
  searchTags?: string
  chapterRoadName?: string
  contentUrl?: string
  viewStyle?: number
}

export function createRule(rule: Rule | any): Rule {
  const now = Date.now() * 1000

  return Object.assign({
    id: uuidV4(),
    createTime: now,
    modifiedTime: now,
    enableUpload: false,
    author: 'AnyReader',
    name: '',
    host: '',
    icon: '',
    group: '',
    contentType: 1,
    sort: 0,
    useCryptoJS: false,
    userAgent: '',
    enableDiscover: false,
    discoverUrl: '',
    discoverList: '',
    discoverTags: '',
    discoverName: '',
    discoverCover: '',
    discoverChapter: '',
    discoverDescription: '',
    discoverResult: '',
    enableSearch: false,
    searchUrl: '',
    searchAuthor: '',
    chapterCover: '',
    chapterTime: '',
    discoverAuthor: '',
    discoverItems: '',
    searchList: '',
    searchTags: '',
    searchName: '',
    searchCover: '',
    searchChapter: '',
    searchDescription: '',
    searchResult: '',
    enableMultiRoads: false,
    chapterRoads: '',
    chapterRoadName: '',
    chapterUrl: '',
    chapterList: '',
    chapterName: '',
    chapterResult: '',
    contentUrl: '',
    contentItems: '',
    viewStyle: 0,
  }, rule)
}

/**
 *
 * @param {string} str
 * @returns {boolean}
 */
export function isEsoStr(str: string): boolean {
  return str.startsWith('eso://')
}

/**
 *
 * @param rule
 * @returns {boolean}
 */
export function isRule(rule: any): boolean {
  if (typeof rule === 'string')
    return isEsoStr(rule)

  if (typeof rule !== 'object')
    return false

  return rule.id && rule.host && typeof rule.contentType !== 'undefined'
}
