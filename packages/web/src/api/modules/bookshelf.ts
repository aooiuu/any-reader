/**
 * 书架
 */

import { request } from '@/utils/request';

// 获取本地
export function getLocalBooks() {
  return request({
    method: 'post',
    url: 'bookshelf/list'
  });
}
