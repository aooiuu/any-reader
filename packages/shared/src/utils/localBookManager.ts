import * as path from 'node:path'
import * as fs from 'node:fs'
import type { BookChapter, BookFile } from './BookParser'
import { getBookParser, path2bookFile } from './BookParser'

export * from './BookParser'

class LocalBookManager {
  // 检查目录
  checkDir(dir: string) {
    if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory())
      fs.mkdirSync(dir)
  }

  // 获取所有书籍
  async getBookList(dir: string): Promise<BookFile[]> {
    this.checkDir(dir)
    return fs.readdirSync(dir)
      .filter(filePath => ['.txt', '.epub'].includes(path.extname(filePath)))
      .map((filePath) => {
        return path2bookFile(path.join(dir, filePath))
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
