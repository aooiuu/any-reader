import * as path from 'node:path'
import * as fs from 'node:fs'
import { LOCAL_BOOK_DIR } from './constants'
import type { BookChapter, BookFile } from './BookParser'
import { getBookParser, path2bookFile } from './BookParser'

export * from './BookParser'

class LocalBookManager {
  // 检查目录
  checkDir(dir: string) {
    if (LOCAL_BOOK_DIR !== dir)
      return

    if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory())
      fs.mkdirSync(dir)
  }

  // 获取所有书籍
  async getBookList(dir: string): Promise<BookFile[]> {
    const _dir = dir || LOCAL_BOOK_DIR
    this.checkDir(_dir)
    return fs.readdirSync(_dir)
      .filter(filePath => ['.txt', '.epub'].includes(path.extname(filePath)))
      .map((filePath) => {
        return path2bookFile(path.join(_dir, filePath))
      })
  }

  // 获取章节
  getChapter(filePath: string): Promise<BookChapter[]> {
    return getBookParser(filePath).getChapter()
  }

  // 获取内容
  async getContent(item: BookChapter): Promise<string> {
    return getBookParser(item.filePath).getContent(item)
  }
}

export default new LocalBookManager()
