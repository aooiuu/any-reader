/**
 * cache
 */

import { request } from '@/utils/request';

export function clear() {
  return request({
    method: 'post',
    url: 'cache/clear'
  });
}
