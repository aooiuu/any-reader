import EPub from '@any-reader/epub';
import type { BookChapter, IBookParser } from '../types';
import { BaseBookParser } from './BaseBookParser';

export default class EPubBookParser extends BaseBookParser implements IBookParser {
  public getChapter(): Promise<BookChapter[]> {
    return new Promise((resolve, reject) => {
      const book = new EPub(this.filePath);
      book.on('end', () => {
        resolve(
          book.flow.map((e: any) => {
            return {
              name: e.title || e.id,
              chapterPath: e.id,
              filePath: this.filePath
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
