import * as path from 'node:path'
import * as fs from 'node:fs'
import EPub from 'epub'
import Encoding from 'encoding-japanese'
import * as iconv from 'iconv-lite'
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
export async function getChapter(filePath: string): Promise<BookChapter[]> {
  const bookFile = path2bookFile(filePath)
  if (bookFile.type === BOOK_TYPE.TXT) {
    return [
      {
        name: '正文',
        path: '',
        file: bookFile,
      },
    ]
  }

  return new Promise((resolve) => {
    const book = new EPub(bookFile.path)
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

// 获取内容
export async function getContent(item: BookChapter): Promise<string> {
  if (item.file.type === BOOK_TYPE.TXT) {
    const buffer = fs.readFileSync(item.file.path)
    const encoding = Encoding.detect(buffer)
    if (encoding === 'UTF8')
      return iconv.decode(buffer, 'utf-8')
    else
      return iconv.decode(buffer, 'GB2312')
  }

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
