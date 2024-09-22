export interface SearchItem {
  url: string;
  name: string;
  cover: string;
  author: string;
  chapter: string;
  description: string;
}

export interface ChapterItem {
  url: string;
  name: string;
  cover: string;
  time: string;
}

// 分类列表
export interface DiscoverItem {
  name: string;
  pairs: Discover[];
}

export interface Discover {
  name: string;
  value: string;
}

export interface IParser {
  search(query: string, page?: number, pageSize?: number): Promise<SearchItem[]>;
  getChapter(result: string): Promise<ChapterItem[]>;
  getContent(result: string): Promise<string[]>;
  discoverMap(): Promise<DiscoverItem[]>;
  discover(result: string): Promise<SearchItem[]>;
  contentDecoder(result: string): Promise<string>;
}
