import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'
import type { Rule } from './rule'
import { createRule } from './rule'

const http = axios.create()

const XML = new XMLParser({
  trimValues: true,
  textNodeName: 'type_name',
  ignoreAttributes: false,
  attributeNamePrefix: 'type_',
  parseAttributeValue: true,
})

export function cmsToRule(json: any, url: string) {
  const u = new URL(url)
  const discoverUrl = [
    '最近更新::/api.php/provide/vod?ac=detail&pg=$page',
    ...json.class.map((row: any) => `${row.type_name}::/api.php/provide/vod?ac=detail&pg=$page&t=${row.type_id}`),
  ].join('\n')

  return createRule({
    name: '',
    host: u.origin,
    contentType: 2,
    enableDiscover: true,
    discoverUrl,
    discoverList: '$.list',
    discoverTags: '$.type_name&&$.vod_time## .*',
    discoverName: '$.vod_name',
    discoverCover: '$.vod_pic',
    discoverChapter: '$.vod_remarks||$.vod_state',
    discoverDescription: '$.vod_content##</?s?pa?n?.*?>',
    discoverResult: '$.vod_id',
    discoverAuthor: '',
    discoverItems: '',
    enableSearch: true,
    searchUrl: '/api.php/provide/vod?ac=detail&pg=$page&wd=$keyword',
    searchAuthor: '',
    searchList: '$.list',
    searchTags: '$.type_name&&$.vod_time## .*',
    searchName: '$.vod_name',
    searchCover: '$.vod_pic',
    searchChapter: '$.vod_remarks||$.vod_state',
    searchDescription: '$.vod_content##</?s?pa?n?.*?>',
    searchResult: '$.vod_id',
    enableMultiRoads: true,
    chapterCover: '',
    chapterTime: '',
    chapterRoads:
      '@js:(async()=>{\n\njson=[];\n$=JSON.parse(result).list[0];\nfrom=String($.vod_play_from).split(\'$$$\');\nString($.vod_play_url).split(\'$$$\').map((a,i)=>{\n\n\n//防止集数重复(判定链接)\nvalues = []\nfunction verify(){\nif( !/^\\s*$/.test(key) && value.length>19 ){\n\t\tv = true\n\t\tvalues.map(url=>{\nif(  !/^\\s*$/.test(url) && value.match(new RegExp(url+\'.*\')) )v=false;\n\t\t\t});\n\t\treturn v\n\t}\n\t\treturn false\n\t}\n\n\n\nlist=[];\na.split(\'#\').map((a,i)=>{a=a.split(\'$\');\n\t\t\t\tif(a.length>1){\n\t\t\t\t\t\tkey = /\\S/.test(a[0])?a[0]:i+1\n\t\t\t\t\t\tvalue = /^\\s*$/.test(a[1])?a[0]:a[1]\n\t\t\t\t\t}\n\t\t\t\telse{\n\t\t\t\t\t\tkey = i+1\n\t\t\t\t\t\tvalue = a[0]\n\t\t\t\t\t}\n\t\t\t\tkey = key.trim();\n\t\t\t\tif( verify() ){\n\t\t\t\t\t\tvalues.push(value.replace(/^.*\\/\\//,\'\').replace(/\\s*$/,\'\').replace(/\\?/g,\'\\\\?\'));\n\t\t\t\t\t\tlist.push({\'name\':key,\'url\':value});\n\t\t\t\t}\n})\n\n\n\n\n\n//只保存有mp4/m3u8链接的线路\nif(/\\.(mp4|m3u8)/.test(list[0].url)){\njson.push({\n            \'roadName\': from[i],\n            \'list\': list,\n        })\n}\n\t})\n    return json\n})()',
    chapterRoadName: '$.roadName',
    chapterUrl: '/api.php/provide/vod?ac=detail&ids=$result',
    chapterList: '$.list',
    chapterName: '$.name',
    chapterResult: '$.url',
    contentUrl: 'null',
    contentItems: '@js:lastResult',
  })
}

export async function cmsJsonToRule(url: string): Promise<Rule> {
  const json: any = await http({
    url,
    headers: {
      'User-Agent':
         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.50',
    },
  }).then(e => e.data)

  return cmsToRule(json, url)
}

export async function cmsXmlToRule(url: string) {
  const res: any = await http({
    url,
    headers: {
      'User-Agent':
         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.50',
    },
  }).then(e => e.data)
  const json = XML.parse(res).rss
  json.class = json.class.ty
  return cmsToRule(json, url)
}
