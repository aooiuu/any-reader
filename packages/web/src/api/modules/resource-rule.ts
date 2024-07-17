/**
 * 规则
 */

import { request } from '@/utils/request';

// 导入规则
export function importCMS(data: any) {
  return request({
    method: 'post',
    url: 'resource-rule/import-cms',
    data
  });
}

// 创建规则
export function createRule(data: any) {
  return request({
    method: 'post',
    url: 'resource-rule/create',
    data
  });
}

// 更新规则
export function updateRule(data: any) {
  return request({
    method: 'post',
    url: 'resource-rule/save',
    data
  });
}

// 获取所有规则
export function getRules() {
  return request({
    method: 'post',
    url: 'resource-rule/list'
  });
}

// 根据ID获取规则
export function getRuleById(id: string) {
  return request({
    method: 'post',
    url: 'resource-rule/find-by-id',
    data: { id }
  });
}

// 删除规则
export function delRules(data: any) {
  return request({
    method: 'post',
    url: 'resource-rule/remove-by-id',
    data
  });
}

// 导入规则
export function importRules(data: any) {
  return request({
    method: 'post',
    url: 'resource-rule/import',
    data
  });
}

// 批量更新规则
export function batchUpdateRules(data: any) {
  return request({
    method: 'post',
    url: 'resource-rule/batch-update',
    data
  });
}

// 测速
export function ping(data: any) {
  return request({
    method: 'post',
    url: 'resource-rule/ping',
    data
  });
}

// 更新排序
export function updateRuleSort(data: any) {
  return request({
    method: 'post',
    url: 'updateRuleSort',
    data
  });
}
