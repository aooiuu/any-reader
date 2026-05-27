import EPub from '@any-reader/epub';
import type { BookChapter, IBookParser } from '../types';
import { BaseBookParser } from './BaseBookParser';

export default class EPubBookParser extends BaseBookParser implements IBookParser {
  /**
   * 读取 EPUB spine 里的章节列表，并保留章节 href 和 spine 顺序用于 annotation 定位。
   */
  public getChapter(): Promise<BookChapter[]> {
    return new Promise((resolve, reject) => {
      const book = new EPub(this.filePath);
      book.on('end', () => {
        resolve(
          book.flow.map((e: any, spineIndex: number) => {
            return {
              name: e.title || e.id,
              chapterPath: e.id,
              filePath: this.filePath,
              chapterHref: e.href,
              spineIndex
            };
          })
        );
      });
      book.on('error', (err: any) => {
        reject(err);
      });
      book.parse();
    });
  }

  /**
   * 读取指定章节正文，返回可直接渲染的 XHTML body 内容。
   */
  public getContent(chapterPath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const book = new EPub(this.filePath);
      book.on('end', () => {
        book.getChapter(chapterPath, (error: any, text: string) => {
          if (error) reject(error);

          resolve([text]);
        });
      });
      book.parse();
    });
  }
}
