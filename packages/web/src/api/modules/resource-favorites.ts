/**
 * 收藏
 */

import { request } from '@/utils/request';

// 获取收藏列表
export function getFavorites() {
  return request({
    method: 'post',
    url: 'resource-favorites/list'
  });
}
// 收藏
export function star(data: any) {
  return request({
    method: 'post',
    url: 'resource-favorites/star',
    data
  });
}

// 取消收藏
export function unstar(data: any) {
  return request({
    method: 'post',
    url: 'resource-favorites/unstar',
    data
  });
}
