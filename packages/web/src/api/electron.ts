import { request } from '@/utils/request';

// 窗口最小化
export function minimize() {
  return request({
    method: 'get',
    url: 'minimize'
  });
}

// 窗口最大化
export function maximize() {
  return request({
    method: 'get',
    url: 'maximize'
  });
}

// 结束
export function exit() {
  return request({
    method: 'get',
    url: 'exit'
  });
}

// 置顶
export function alwaysOnTop(pinned: boolean) {
  return request({
    method: 'post',
    url: 'alwaysOnTop',
    data: {
      pinned
    }
  });
}
