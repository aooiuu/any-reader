/**
 * 历史
 */

import { request } from '@/utils/request';

// 获取历史
export function getHistory() {
  return request({
    method: 'post',
    url: 'resource-history/list'
  });
}

// 删除历史
export function removeHistory(data: { ruleId: string; url: string }) {
  return request({
    method: 'post',
    url: 'resource-history/remove',
    data
  });
}

// 添加历史
export function addHistory(data: any) {
  return request({
    method: 'post',
    url: 'resource-history/add',
    data
  });
}
