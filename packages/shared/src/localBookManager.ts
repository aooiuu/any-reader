import * as path from 'node:path'
import * as fs from 'node:fs'
import * as iconv from 'iconv-lite'
import chardet from 'chardet'
import EPub from '@any-reader/epub'

// import { parseEpub } from '@gxl/epub-parser'

import { LOCAL_BOOK_DIR } from './constants'

export enum BOOK_TYPE {
  TXT = 1,
  EPUB = 2,
}

export interface BookFile {
  path: string
  type: BOOK_TYPE
  name: string
}

export interface BookChapter {
  name: string
  path: string
  file: BookFile
}

export type TreeNode = BookFile | BookChapter

abstract class BookParser {
  protected _filePath: string
  /**
   *
   * @param {string} filePath 路径
   */
  constructor(filePath: string) {
    this._filePath = filePath
  }

  /**
   * 获取章节
   */
  public abstract getChapter(): Promise<BookChapter[]>

  /**
   * 获取内容
   * @param item
   */
  public abstract getContent(item: BookChapter): Promise<string>
}

// 缓存最后一个文件
const mCache = new Map<string, string>()
class TXTBookParser extends BookParser {
  private chapterPattern = /^第[\d|一|二|三|四|五|六|七|八|九|十|百]*[章|节|集]/

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

    const bookFile = path2bookFile(this._filePath)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (this.chapterPattern.test(line)) {
        result.push({
          name: line,
          path: i.toString(),
          file: bookFile,
        })
      }
    }

    if (result.length)
      return Promise.resolve(result)

    return Promise.resolve([
      {
        name: '正文',
        path: '',
        file: bookFile,
      },
    ])
  }

  getContent(item: BookChapter): Promise<string> {
    const text = this._getText(this._filePath)
    const lines = text.split(/\r?\n/)
    if (item.path === '')
      return Promise.resolve(text)
    let result = ''

    for (let i = +item.path + 1; i < lines.length; i++) {
      const line = lines[i]
      if (this.chapterPattern.test(line))
        break
      result += `${lines[i]}\n`
    }
    return Promise.resolve(result)
  }
}

// class EPubBookParser extends BookParser {
//   async getChapter(): Promise<BookChapter[]> {
//     const bookFile = path2bookFile(this._filePath)
//     const book = await parseEpub(this._filePath, {
//       type: 'path',
//     })
//     if (!book.structure)
//       return []
//     return book.structure.map((row: { name: any; path: any }) => ({
//       name: row.name,
//       path: row.path,
//       file: bookFile,
//     }))
//   }

//   async getContent(item: BookChapter): Promise<string> {
//     const book = await parseEpub(this._filePath, {
//       type: 'path',
//     })
//     if (!book.structure)
//       return ''

//     return book.sections?.find(e => `${e.id}.html` === item.path)?.htmlString || ''
//   }
// }

class EPubBookParser extends BookParser {
  public getChapter(): Promise<BookChapter[]> {
    const bookFile = path2bookFile(this._filePath)
    return new Promise((resolve) => {
      const book = new EPub(this._filePath)
      book.on('end', () => {
        resolve(
          book.flow.map((e) => {
            return {
              name: e.title || e.id,
              path: e.id,
              file: bookFile,
            }
          }),
        )
      })
      book.parse()
    })
  }

  public getContent(item: BookChapter): Promise<string> {
    return new Promise((resolve, reject) => {
      const book = new EPub(item.file.path)
      book.on('end', () => {
        book.getChapter(item.path, (error, text) => {
          if (error)
            reject(error)

          resolve(text)
        })
      })
      book.parse()
    })
  }
}

function getBookParser(filePath: string): BookParser {
  if (path.extname(filePath) === '.txt')
    return new TXTBookParser(filePath)
  return new EPubBookParser(filePath)
}

// 检查目录
export function checkDir() {
  if (!fs.existsSync(LOCAL_BOOK_DIR) || !fs.lstatSync(LOCAL_BOOK_DIR).isDirectory())
    fs.mkdirSync(LOCAL_BOOK_DIR)
}

export function path2bookFile(filePath: string): BookFile {
  return {
    type: getBookType(filePath),
    name: path.basename(filePath, path.extname(filePath)),
    path: filePath,
  }
}

// 获取书籍类型
export function getBookType(filePath: string) {
  return path.extname(filePath) === '.txt' ? BOOK_TYPE.TXT : BOOK_TYPE.EPUB
}

// 获取所有书籍
export async function getBookList(): Promise<BookFile[]> {
  const dir = LOCAL_BOOK_DIR
  checkDir()

  const files = fs.readdirSync(dir)

  return files
    .filter(filePath => ['.txt', '.epub'].includes(path.extname(filePath)))
    .map((filePath) => {
      return path2bookFile(path.join(dir, filePath))
    })
}

// 获取章节
export function getChapter(filePath: string): Promise<BookChapter[]> {
  return getBookParser(filePath).getChapter()
}

// 获取内容
export async function getContent(item: BookChapter): Promise<string> {
  return getBookParser(item.file.path).getContent(item)
}
