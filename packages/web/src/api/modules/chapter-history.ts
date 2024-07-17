/**
 * 阅读进度
 */

import { request } from '@/utils/request';

export function saveChapterHistory(data: any) {
  return request({
    method: 'post',
    url: 'chapter-history/save',
    data
  });
}

export function getChapterHistorys(data: any) {
  return request({
    method: 'post',
    url: 'chapter-history/list',
    data
  });
}
