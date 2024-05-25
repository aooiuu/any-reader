import * as path from 'node:path'

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
  chapterPath: string
  filePath: string
}

export type TreeNode = BookFile | BookChapter

export abstract class BookParser {
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
