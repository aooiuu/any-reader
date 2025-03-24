import { v4 as uuidV4 } from 'uuid';
import { decodeRule } from './comparess';
import axios from 'axios';

/**
 * 内容类型枚举
 * @enum {number}
 */
export enum ContentType {
  /** 漫画类型 */
  MANGA = 0,
  /** 小说类型 */
  NOVEL = 1,
  /** 视频类型 */
  VIDEO = 2,
  /** 音频类型 */
  AUDIO = 3,
  /** RSS类型 */
  RSS = 4,
  /** 小说更多类型 */
  NOVELMORE = 5,

  /** 游戏类型 */
  GAME = 101
}

export interface ContentResponse {
  contentType?: ContentType;
  content: string[];
  /** 是否需要正文解密 */
  contentDecoder: boolean;
}

/**
 * 规则接口定义
 * @interface Rule
 */
export interface Rule {
  // ===== 通用字段 =====
  /** 域名 */
  host: string;
  /** 规则唯一标识 UUID */
  id: string;
  /** 书源名称 */
  name: string;
  /** 书源排序 */
  sort: number;
  /** 书源类型 */
  contentType: ContentType;
  /** 全局JS脚本 */
  loadJs: string;
  /** 规则作者 */
  author: string;
  /** Headers JSON字符串 */
  userAgent: string;

  // ===== 解析流程 - 搜索 =====
  /** 搜索 - 是否启用 */
  enableSearch: boolean;
  /** 搜索 - 请求地址 */
  searchUrl: string;
  /** 搜索 - 列表选择器 */
  searchList: string;
  /** 搜索 - 封面选择器 */
  searchCover: string;
  /** 搜索 - 标题选择器 */
  searchName: string;
  /** 搜索 - 作者选择器 */
  searchAuthor: string;
  /** 搜索 - 章节选择器 */
  searchChapter: string;
  /** 搜索 - 描述选择器 */
  searchDescription: string;
  /** 搜索 - 结果处理脚本 */
  searchResult: string;

  // ===== 解析流程 - 章节列表 =====
  /** 章节列表 - 请求地址 */
  chapterUrl: string;
  /** 章节列表 - 标题选择器 */
  chapterName: string;
  /** 章节列表 - 列表选择器 */
  chapterList: string;
  /** 章节列表 - 封面选择器 */
  chapterCover: string;
  /** 章节列表 - 时间选择器 */
  chapterTime: string;
  /** 章节列表 - 结果处理脚本 */
  chapterResult: string;
  /** 章节列表 - 内容选择器 */
  contentItems: string;
  /** 是否启用多线路 */
  enableMultiRoads: boolean;
  /** 线路列表选择器 */
  chapterRoads: string;
  /** 章节列表下一页地址选择器 */
  chapterNextUrl: string;

  // ===== 解析流程 - 发现页 =====
  /** 发现页 - 是否启用 */
  enableDiscover: boolean;
  /** 发现页 - 请求地址 */
  discoverUrl: string;
  /** 发现页 - 列表选择器 */
  discoverList: string;
  /** 发现页 - 标题选择器 */
  discoverName: string;
  /** 发现页 - 封面选择器 */
  discoverCover: string;
  /** 发现页 - 作者选择器 */
  discoverAuthor: string;
  /** 发现页 - 描述选择器 */
  discoverDescription: string;
  /** 发现页 - 结果处理脚本 */
  discoverResult: string;
  /** 发现页 - 标签选择器 */
  discoverTags: string;
  /** 发现页 - 章节选择器 */
  discoverChapter: string;
  /** 发现页 - 下一页地址选择器 */
  discoverNextUrl: string;

  // ===== 解析流程 - 正文 =====
  /** 正文 - 请求地址 */
  contentUrl: string;
  /** 正文 - 下一页地址 */
  contentNextUrl: string;
  /** 正文 - 内容解码脚本 */
  contentDecoder: string;

  // ===== 暂不支持 =====
  /** 创建时间 */
  createTime?: number;
  /** 修改时间 */
  modifiedTime?: number;
  /** 是否启用上传 */
  enableUpload?: boolean;
  /** 图标 */
  icon?: string;
  /** 分组 */
  group?: string;
  /** 是否使用 CryptoJS */
  useCryptoJS?: boolean;
  /** 搜索标签选择器 */
  searchTags?: string;
  /** 章节路线名称选择器 */
  chapterRoadName?: string;
  /** 视图样式 */
  viewStyle?: number;
  /** Cookies */
  cookies?: string;
}

/**
 * 创建规则对象
 * @param rule - 部分规则对象
 * @returns 完整的规则对象
 */
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
      contentDecoder: '',
      viewStyle: 0
    },
    rule
  );
}

/**
 * 检查字符串是否为 ESO 格式
 * @param str - 待检查的字符串
 * @returns 是否为 ESO 格式
 */
export function isEsoStr(str: string): boolean {
  return typeof str === 'string' && str.startsWith('eso://');
}

/**
 * 检查对象是否为有效的规则对象
 * @param rule - 待检查的对象
 * @returns 是否为有效的规则对象
 */
export function isEsoObj(rule: any): boolean {
  return typeof rule === 'object' && rule.id && rule.host && typeof rule.contentType !== 'undefined';
}

/**
 * 检查输入是否为有效的规则
 * @param rule - 待检查的规则
 * @returns 是否为有效的规则
 */
export function isRule(rule: any): boolean {
  if (typeof rule === 'string') return isEsoStr(rule);
  if (typeof rule !== 'object') return false;
  return isEsoObj(rule);
}

/**
 * 将文本转换为规则数组
 * @param text - 输入文本，可以是URL、JSON字符串或ESO格式字符串
 * @returns 规则数组
 * @throws 当JSON解析失败时可能抛出错误
 */
export async function text2rules(text: string): Promise<Rule[]> {
  const result: Rule[] = [];
  if (typeof text !== 'string') return [];
  const url = text.trim();
  // 单个压缩规则
  if (isEsoStr(url)) {
    return [decodeRule(url)];
  }

  // 网络地址
  if (/^https?:\/\/.{3,}/.test(url)) {
    const res = await axios
      .create()
      .get(url)
      .catch((e) => {
        console.warn(e);
      });
    const rows = res?.data || [];
    if (typeof rows === 'string') return await text2rules(rows);
    if (!Array.isArray(rows)) return result;
    for (const rule of rows) {
      if (isEsoObj(rule)) {
        result.push(rule);
      } else if (isEsoStr(rule)) {
        result.push(decodeRule(rule));
      }
    }
    return result;
  }
  // json 字符串
  let json;
  try {
    json = JSON.parse(url);
  } catch (error) {
    console.warn('导入格式不支持');
  }
  if (typeof json !== 'object') return result;
  const jsons = Array.isArray(json) ? json : [json];
  for (const json of jsons) {
    if (isEsoObj(json)) {
      result.push(json);
    } else if (isEsoStr(json)) {
      result.push(decodeRule(json));
    }
  }
  return result;
}
