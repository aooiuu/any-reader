import { fromByteArray, toByteArray } from 'base64-js'
import { deflate, inflate } from 'pako'
import { v4 as uuidV4 } from 'uuid'
import axios from 'axios'

const http = axios.create()

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

/**
 * 规则解码
 * @param {string} text
 * @returns
 */
export function decodeRule(text: string) {
  const lastIndex = text.lastIndexOf('@')
  const gzipBytes = toByteArray(text.substring(lastIndex + 1))
  return JSON.parse(inflate(gzipBytes, { to: 'string' }))
}

/**
 * 规则编码
 * @param text
 * @returns
 */
export function encodeRule(text: any): string {
  const rule = typeof text === 'string' ? JSON.parse(text) : text
  const ruleText = typeof text === 'string' ? text : JSON.stringify(text)
  const tag = 'eso://'
  const encodeRuleText = fromByteArray(deflate(ruleText))
  return `${tag}${rule.author || ''}:${rule.name || ''}@${encodeRuleText}`
}

export async function cmsJsonToRule(url: string, name: string): Promise<Rule> {
  const now = Date.now() * 1000
  const u = new URL(url)

  const res: any = await http({
    url,
    headers: {
      'User-Agent':
         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.50',
    },
  }).then(e => e.data)

  const discoverUrl = [
    '最近更新::/api.php/provide/vod?ac=detail&pg=$page',
    ...res.class.map((row: any) => `${row.type_name}::/api.php/provide/vod?ac=detail&pg=$page&t=${row.type_id}`),
  ].join('\n')

  return {
    id: uuidV4(),
    createTime: now,
    modifiedTime: now,
    enableUpload: false,
    author: 'AnyReader',
    name,
    host: u.origin,
    icon: '',
    group: '',
    contentType: 2,
    sort: 0,
    useCryptoJS: false,
    userAgent: '',
    enableDiscover: true,
    discoverUrl,
    discoverList: '$.list',
    discoverTags: '$.type_name&&$.vod_time## .*',
    discoverName: '$.vod_name',
    discoverCover: '$.vod_pic',
    discoverChapter: '$.vod_remarks||$.vod_state',
    discoverDescription: '$.vod_content##</?s?pa?n?.*?>',
    discoverResult: '$.vod_id',
    enableSearch: true,
    searchUrl: '/api.php/provide/vod?ac=detail&pg=$page&wd=$keyword',
    searchAuthor: '',
    chapterCover: '',
    chapterTime: '',
    discoverAuthor: '',
    discoverItems: '',
    searchList: '$.list',
    searchTags: '$.type_name&&$.vod_time## .*',
    searchName: '$.vod_name',
    searchCover: '$.vod_pic',
    searchChapter: '$.vod_remarks||$.vod_state',
    searchDescription: '$.vod_content##</?s?pa?n?.*?>',
    searchResult: '$.vod_id',
    enableMultiRoads: true,
    chapterRoads:
      '@js:(async()=>{\n\njson=[];\n$=JSON.parse(result).list[0];\nfrom=String($.vod_play_from).split(\'$$$\');\nString($.vod_play_url).split(\'$$$\').map((a,i)=>{\n\n\n//防止集数重复(判定链接)\nvalues = []\nfunction verify(){\nif( !/^\\s*$/.test(key) && value.length>19 ){\n\t\tv = true\n\t\tvalues.map(url=>{\nif(  !/^\\s*$/.test(url) && value.match(new RegExp(url+\'.*\')) )v=false;\n\t\t\t});\n\t\treturn v\n\t}\n\t\treturn false\n\t}\n\n\n\nlist=[];\na.split(\'#\').map((a,i)=>{a=a.split(\'$\');\n\t\t\t\tif(a.length>1){\n\t\t\t\t\t\tkey = /\\S/.test(a[0])?a[0]:i+1\n\t\t\t\t\t\tvalue = /^\\s*$/.test(a[1])?a[0]:a[1]\n\t\t\t\t\t}\n\t\t\t\telse{\n\t\t\t\t\t\tkey = i+1\n\t\t\t\t\t\tvalue = a[0]\n\t\t\t\t\t}\n\t\t\t\tkey = key.trim();\n\t\t\t\tif( verify() ){\n\t\t\t\t\t\tvalues.push(value.replace(/^.*\\/\\//,\'\').replace(/\\s*$/,\'\').replace(/\\?/g,\'\\\\?\'));\n\t\t\t\t\t\tlist.push({\'name\':key,\'url\':value});\n\t\t\t\t}\n})\n\n\n\n\n\n//只保存有mp4/m3u8链接的线路\nif(/\\.(mp4|m3u8)/.test(list[0].url)){\njson.push({\n            \'roadName\': from[i],\n            \'list\': list,\n        })\n}\n\t})\n    return json\n})()',
    chapterRoadName: '$.roadName',
    chapterUrl: '/api.php/provide/vod?ac=detail&ids=$result',
    chapterList: '$.list',
    chapterName: '$.name',
    chapterResult: '$.url',
    contentUrl: 'null',
    contentItems: '@js:lastResult',
    viewStyle: 0,
  }
}
