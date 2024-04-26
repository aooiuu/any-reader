import * as path from 'node:path'
import * as fs from 'fs-extra'
import Encoding from 'encoding-japanese'
import * as iconv from 'iconv-lite'
import { LOCAL_BOOK_DIR } from './constants'

enum BOOK_TYPE {
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
  file: BookFile
}

export type TreeNode = BookFile | BookChapter

export function checkDir() {
  if (!fs.existsSync(LOCAL_BOOK_DIR) || !fs.lstatSync(LOCAL_BOOK_DIR).isDirectory())
    fs.mkdirSync(LOCAL_BOOK_DIR)
}

// 获取所有书籍
export async function getBookList(): Promise<BookFile[]> {
  const dir = LOCAL_BOOK_DIR
  checkDir()

  const files = fs.readdirSync(dir)

  return files
    .filter(f => ['.txt'].includes(path.extname(f)))
    .map((f) => {
      return {
        type: BOOK_TYPE.TXT,
        name: path.basename(f, path.extname(f)),
        path: path.join(dir, f),
      }
    })
}
// 获取章节
export function getChapter(bookFile: BookFile): BookChapter[] {
  if (bookFile.type === BOOK_TYPE.TXT) {
    return [
      {
        name: '正文',
        file: bookFile,
      },
    ]
  }
  return []
}

// 获取内容
export function getContent(item: BookChapter) {
  if (item.file.type === BOOK_TYPE.TXT) {
    const buffer = fs.readFileSync(item.file.path)
    const encoding = Encoding.detect(buffer)
    if (encoding === 'UTF8')
      return iconv.decode(buffer, 'utf-8')
    else
      return iconv.decode(buffer, 'GB2312')
  }
  return ''
}
