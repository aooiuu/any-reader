/**
 * web
 */

import { request } from '@/utils/request';

export function install(data: { password: string }) {
  return request({
    method: 'post',
    url: 'install',
    data
  });
}

export function login(data: { password: string }) {
  return request({
    method: 'post',
    url: 'login',
    data
  });
}

export function logout() {
  return request({
    method: 'get',
    url: 'logout'
  });
}
