import * as fs from 'node:fs'
import * as iconv from 'iconv-lite'
import chardet from 'chardet'
import type { BookChapter } from './BookParser'
import { BookParser } from './BookParser'

// 缓存最后一个文件
const mCache = new Map<string, string>()
export default class TXTBookParser extends BookParser {
  private chapterPattern = /^第\s{0,4}[\d〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]+?\s{0,4}(?:章|节(?!课)|卷|页|集|部|篇(?!张)).{0,40}$/

  private _getText(filePath: string): string {
    if (mCache.has(filePath))
      return mCache.get(filePath) as string
    mCache.clear()

    const sourceFile = fs.readFileSync(filePath)
    const encoding = chardet.detect(sourceFile)
    const text = iconv.decode(sourceFile, encoding as string)
    mCache.set(filePath, text)
    return text
  }

  getChapter(): Promise<BookChapter[]> {
    const text = this._getText(this._filePath)
    const lines = text.split(/\r?\n/)
    const result: BookChapter[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (this.chapterPattern.test(line)) {
        result.push({
          name: line.trim(),
          chapterPath: i.toString(),
          filePath: this._filePath,
        })
      }
    }

    if (result.length)
      return Promise.resolve(result)

    return Promise.resolve([
      {
        name: '正文',
        chapterPath: '',
        filePath: this._filePath,
      },
    ])
  }

  getContent(item: BookChapter): Promise<string[]> {
    const text = this._getText(this._filePath)
    const lines = text.split(/\r?\n/)
    if (item.chapterPath === '')
      return Promise.resolve([text])
    const result = []

    for (let i = +item.chapterPath + 1; i < lines.length; i++) {
      const line = lines[i]
      if (this.chapterPattern.test(line))
        break

      result.push(lines[i])
    }
    return Promise.resolve(result)
  }
}
