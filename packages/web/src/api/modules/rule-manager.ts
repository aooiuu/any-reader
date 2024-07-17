/**
 * 解析
 */

import { request } from '@/utils/request';

// 发现页分类列表
export function discoverMap(ruleId: string) {
  return request({
    method: 'post',
    url: 'rule-manager/discover-map',
    data: {
      ruleId
    }
  });
}

// 发现页分类下内容
export function discover(data: any) {
  return request({
    method: 'post',
    url: 'rule-manager/discover',
    data
  });
}

// 根据规则ID搜索内容
export function searchByRuleId(data: { ruleId: string; keyword: string }) {
  return request({
    method: 'post',
    url: 'rule-manager/search-by-rule-id',
    data,
    showMsg: false
  });
}

// 获取内容
export function getContent(data: any) {
  return request({
    method: 'post',
    url: 'rule-manager/content',
    data
  });
}

// 获取章节
export function getChapter(filePath: string, ruleId?: string) {
  return request({
    method: 'post',
    url: 'rule-manager/chapter',
    data: {
      filePath,
      ruleId
    }
  });
}
