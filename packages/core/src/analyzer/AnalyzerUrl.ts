import axios from 'axios'
import type { Rule } from '../..'
import { JSEngine } from './JSEngine'

const http = axios.create()

/**
*
* @param url
* @param keyword
* @param result
* @returns
*/
export async function fetch(url: string, keyword = '', result = '', rule: Rule) {
  const vars: any = {
    $keyword: keyword,
    searchKey: keyword,
    $host: rule.host,
    $result: result,
    searchPage: 1,
    $page: 1,
    $pageSize: 20,
  }

  let params: any = {
    method: 'get',
    url,
  }

  // TODO: 编码 encoding
  if (params.url.startsWith('@js:')) {
    params = JSEngine.evaluate(url.substring(4), {
      ...vars,
      keyword,
    }).catch(() => ({}))
  }
  else {
    params.url = params.url.replace(
      /\$keyword|\$page|\$host|\$result|\$pageSize|searchKey|searchPage/g,
      (m: string | number) => vars[m] || '',
    )
    if (params.url.startsWith('{'))
      Object.assign(params, JSON.parse(params.url))

    const host = rule.host.trim()
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

  if (!params.headers) {
    params.headers = {
      'user-agent':
       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.50',
    }
  }

  const ua = rule.userAgent
  if (typeof ua === 'string') {
    if (ua.startsWith('{') && ua.endsWith('}'))
      Object.assign(params.headers, JSON.parse(ua))
    else
      params.headers['user-agent'] = ua
  }
  else if (typeof ua === 'object') {
    Object.assign(params.headers, ua)
  }

  let responseEncoding = params.encoding || 'utf-8'
  if (responseEncoding === 'gb2312')
    responseEncoding = 'gbk'

  const body = await http(params, {
    responseType: 'text',
    responseEncoding,
  })
    .then(e => e.data)
    .catch(() => {})

  return {
    params,
    body,
  }
}

// 在 eso 是返回字符串
export async function __http__(url: string, rule: Rule): Promise<string> {
  return (await fetch(url, '', '', rule).catch(() => ({ body: '' }))).body
}
