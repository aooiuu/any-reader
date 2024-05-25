import EPub from '@any-reader/epub'
import type { BookChapter } from './BookParser'
import { BookParser } from './BookParser'

export class EPubBookParser extends BookParser {
  public getChapter(): Promise<BookChapter[]> {
    return new Promise((resolve) => {
      const book = new EPub(this._filePath)
      book.on('end', () => {
        resolve(
          book.flow.map((e) => {
            return {
              name: e.title || e.id,
              chapterPath: e.id,
              filePath: this._filePath,
            }
          }),
        )
      })
      book.parse()
    })
  }

  public getContent(item: BookChapter): Promise<string> {
    return new Promise((resolve, reject) => {
      const book = new EPub(item.filePath)
      book.on('end', () => {
        book.getChapter(item.chapterPath, (error, text) => {
          if (error)
            reject(error)

          resolve(text)
        })
      })
      book.parse()
    })
  }
}
