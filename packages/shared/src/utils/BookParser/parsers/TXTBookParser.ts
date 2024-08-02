import * as fs from 'node:fs'
import iconv from 'iconv-lite'
import chardet from 'chardet'
import type { BookChapter, IBookParser } from '../types'
import { BaseBookParser } from './BaseBookParser'

export default class TXTBookParser extends BaseBookParser implements IBookParser {
  private chapterPattern = /^第\s{0,4}[\d〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]+?\s{0,4}(?:章|节(?!课)|卷|页|集|部|篇(?!张)).{0,40}$/

  private _getText(filePath: string): string {
    const sourceFile = fs.readFileSync(filePath)
    const encoding = chardet.detect(sourceFile)
    const text = iconv.decode(sourceFile, encoding as string)
    return text
  }

  getChapter(): Promise<BookChapter[]> {
    const text = this._getText(this.filePath)
    const lines = text.split(/\r?\n/)
    const result: BookChapter[] = []
    let firstText: string = ''

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!firstText && line)
        firstText = line

      if (this.chapterPattern.test(line)) {
        if (result.length === 0 && i > 0) {
          result.push({
            name: firstText,
            chapterPath: '0',
            filePath: this.filePath,
          })
        }

        result.push({
          name: line,
          chapterPath: i.toString(),
          filePath: this.filePath,
        })
      }
    }

    if (result.length)
      return Promise.resolve(result)

    return Promise.resolve([
      {
        name: '正文',
        chapterPath: '',
        filePath: this.filePath,
      },
    ])
  }

  getContent(chapterPath: string): Promise<string[]> {
    const text = this._getText(this.filePath)
    const lines = text.split(/\r?\n/)
    if (chapterPath === '')
      return Promise.resolve([text])
    const result = []

    for (let i = +chapterPath + 1; i < lines.length; i++) {
      const line = lines[i]
      if (this.chapterPattern.test(line))
        break

      const text = lines[i].trim()
      text && result.push(text)
    }
    return Promise.resolve(result)
  }
}
