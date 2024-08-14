export interface BookChapter {
  name: string;
  chapterPath: string;
  filePath: string;
}

export interface IBookParser {
  /**
   * 获取章节
   */
  getChapter(): Promise<BookChapter[]>;

  /**
   * 获取内容
   * @param item
   */
  getContent(chapterPath: string): Promise<string[]>;
}
