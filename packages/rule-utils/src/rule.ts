import { v4 as uuidV4 } from 'uuid';

export enum ContentType {
  MANGA = 0,
  NOVEL = 1,
  VIDEO = 2,
  AUDIO = 3,
  RSS = 4,
  NOVELMORE = 5,

  GAME = 101
}

export interface Rule {
  // ===== 通用字段 =====
  host: string; // 域名
  id: string; // uuid
  name: string; // 书源名称
  sort: number; // 书源排序
  contentType: ContentType; // 书源类型
  loadJs: string; // 全局JS脚本
  author: string; // 规则作者
  userAgent: string; // Headers JSON字符串

  // ===== 解析流程 - 搜索 =====
  enableSearch: boolean; // 搜索 - 启用
  searchUrl: string; // 搜索 - 地址
  searchList: string; // 搜索 - 列表
  searchCover: string; // 搜索 - 封面
  searchName: string; // 搜索 - 标题
  searchAuthor: string; // 搜索 - 作者
  searchChapter: string; // 搜索 - 章节
  searchDescription: string; // 搜索 - 描述
  searchResult: string; // 搜索 - 结果

  // ===== 解析流程 - 章节列表 =====
  chapterUrl: string; // 章节列表 - 请求地址
  chapterName: string; // 章节列表 - 标题
  chapterList: string; // 章节列表 - 列表
  chapterCover: string; // 章节列表 - 封面
  chapterTime: string; // 章节列表 - 时间
  chapterResult: string; // 章节列表 - 结果
  contentItems: string; // 章节列表 - 内容
  enableMultiRoads: boolean; // 启用多线路 暂不支持
  chapterRoads: string; // 线路列表 暂不支持
  chapterNextUrl: string; // 章节列表下一页地址

  // ===== 解析流程 - 发现页 =====
  enableDiscover: boolean; // 发现页 - 是否启用
  discoverUrl: string; // 发现页 - 请求地址
  discoverList: string; // 发现页 - 列表
  discoverName: string; // 发现页 - 标题
  discoverCover: string; // 发现页 - 封面
  discoverAuthor: string; // 发现页 - 作者
  discoverDescription: string; // 发现页 - 描述
  discoverResult: string; // 发现页 - 结果
  // discoverItems: string
  discoverTags: string;
  discoverChapter: string;
  discoverNextUrl: string; // 下一页地址

  // ===== 解析流程 - 正文 =====
  contentUrl: string;
  contentNextUrl: string;

  // ===== 暂不支持 =====
  createTime?: number;
  modifiedTime?: number;
  enableUpload?: boolean;
  icon?: string;
  group?: string;
  useCryptoJS?: boolean;
  searchTags?: string;
  chapterRoadName?: string;
  viewStyle?: number;
  cookies?: string;
}

export function createRule(rule: Partial<Rule>): Rule {
  const now = Date.now() * 1000;

  return Object.assign(
    {
      id: uuidV4(),
      createTime: now,
      modifiedTime: now,
      enableUpload: false,
      author: '',
      loadJs: '',
      cookies: '',
      name: '',
      host: '',
      icon: '',
      group: '',
      contentType: 1,
      sort: 0,
      useCryptoJS: false,
      userAgent: '',
      enableDiscover: false,
      discoverUrl: '',
      discoverNextUrl: '',
      discoverList: '',
      discoverTags: '',
      discoverName: '',
      discoverCover: '',
      discoverChapter: '',
      discoverDescription: '',
      discoverResult: '',
      enableSearch: false,
      searchUrl: '',
      searchAuthor: '',
      chapterCover: '',
      chapterTime: '',
      discoverAuthor: '',
      // discoverItems: '',
      searchList: '',
      searchTags: '',
      searchName: '',
      searchCover: '',
      searchChapter: '',
      searchDescription: '',
      searchResult: '',
      enableMultiRoads: false,
      chapterRoads: '',
      chapterRoadName: '',
      chapterUrl: '',
      chapterNextUrl: '',
      chapterList: '',
      chapterName: '',
      chapterResult: '',
      contentUrl: '',
      contentNextUrl: '',
      contentItems: '',
      viewStyle: 0
    },
    rule
  );
}

/**
 *
 * @param {string} str
 * @returns {boolean}
 */
export function isEsoStr(str: string): boolean {
  return str.startsWith('eso://');
}

/**
 *
 * @param rule
 * @returns {boolean}
 */
export function isRule(rule: any): boolean {
  if (typeof rule === 'string') return isEsoStr(rule);

  if (typeof rule !== 'object') return false;

  return rule.id && rule.host && typeof rule.contentType !== 'undefined';
}
