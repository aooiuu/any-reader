import { CONTENT_TYPES } from '@/constants';
import type { Rule } from '@any-reader/rule-utils';
import { ContentType as ContentType } from '@any-reader/rule-utils';

export interface FormItem {
  prop: keyof Rule;
  label: string;
  show?: (rule: Rule) => boolean;
  formStep?: number;
  type?: string;
  options?: any[];
  debug?: boolean;
}

export const FORM_ITEMS: FormItem[] = [
  { prop: 'id', label: 'uuid', show: () => false },
  { prop: 'name', label: '名称', formStep: 1 },
  {
    prop: 'contentType',
    label: '类型',
    type: 'select',
    formStep: 1,
    options: CONTENT_TYPES.filter((v) => [ContentType.GAME, ContentType.MANGA, ContentType.NOVEL, ContentType.VIDEO].includes(v.value))
  },
  { prop: 'host', label: '域名', formStep: 1 },
  { prop: 'sort', label: '排序', formStep: 1, type: 'number' },
  { prop: 'loadJs', label: '全局JS脚本', formStep: 1, type: 'textarea' },
  { prop: 'userAgent', label: 'userAgent', formStep: 1, type: 'textarea' },
  // { prop: 'cookies', label: 'cookies', formStep: 1 },

  {
    prop: 'enableSearch',
    label: '是否启用',
    type: 'switch',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 2
  },
  {
    prop: 'searchUrl',
    label: '搜索地址',
    type: 'textarea',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 2,
    debug: true
  },
  {
    prop: 'searchList',
    label: '搜索列表',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 2,
    debug: true
  },
  {
    prop: 'searchCover',
    label: '封面',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 2,
    debug: true
  },
  {
    prop: 'searchName',
    label: '标题',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 2,
    debug: true
  },
  {
    prop: 'searchAuthor',
    label: '作者',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 2,
    debug: true
  },
  {
    prop: 'searchChapter',
    label: '章节',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 2,
    debug: true
  },
  {
    prop: 'searchDescription',
    label: '描述',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 2,
    debug: true
  },
  {
    prop: 'searchResult',
    label: '搜索结果',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 2,
    debug: true
  },

  {
    prop: 'chapterUrl',
    label: '章节地址',
    type: 'textarea',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 3,
    debug: true
  },
  {
    prop: 'chapterName',
    label: '标题',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 3,
    debug: true
  },
  {
    prop: 'chapterList',
    label: '列表',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 3,
    debug: true
  },
  {
    prop: 'chapterCover',
    label: '封面',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 3,
    debug: true
  },
  {
    prop: 'chapterTime',
    label: '时间',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 3,
    debug: true
  },
  {
    prop: 'chapterResult',
    label: '结果',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 3,
    debug: true
  },

  {
    prop: 'contentItems',
    label: '内容',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 4,
    debug: true
  },

  {
    prop: 'enableDiscover',
    label: '是否启用',
    type: 'switch',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 5,
    debug: true
  },
  {
    prop: 'discoverUrl',
    label: '请求地址',
    type: 'textarea',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 5,
    debug: true
  },
  {
    prop: 'discoverList',
    label: '列表',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 5,
    debug: true
  },
  {
    prop: 'discoverName',
    label: '标题',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 5,
    debug: true
  },
  {
    prop: 'discoverCover',
    label: '封面',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 5,
    debug: true
  },
  {
    prop: 'discoverAuthor',
    label: '作者',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 5,
    debug: true
  },
  {
    prop: 'discoverDescription',
    label: '描述',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 5,
    debug: true
  },
  {
    prop: 'discoverResult',
    label: '结果',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 5,
    debug: true
  },
  // {
  //   prop: 'discoverItems',
  //   label: '内容',
  //   show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
  //   formStep: 5
  // },
  {
    prop: 'discoverTags',
    label: '标签',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 5,
    debug: true
  },
  {
    prop: 'discoverChapter',
    label: '章节',
    show: (item: Rule) => [ContentType.NOVEL, ContentType.VIDEO, ContentType.MANGA].includes(item.contentType),
    formStep: 5,
    debug: true
  }
];
