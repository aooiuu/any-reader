/**
 * 配置
 */

import { request } from '@/utils/request';

// 获取配置
export function readConfig() {
  return request({
    method: 'post',
    url: 'config/read'
  });
}

// 更新配置
export function updateConfig(data: any) {
  return request({
    method: 'post',
    url: 'config/save',
    data
  });
}
