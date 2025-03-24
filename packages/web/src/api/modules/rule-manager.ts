/**
 * 解析
 */

import { request } from '@/utils/request';
import type { ContentResponse } from '@any-reader/rule-utils';

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

export function discoverMapByRule(data: any) {
  return request({
    method: 'post',
    url: 'rule-manager/discover-map-by-rule',
    data
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

export function discoverByRule(data: any) {
  return request({
    method: 'post',
    url: 'rule-manager/discover-by-rule',
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

// 根据规则搜索内容
export function searchByRule(data: any) {
  return request({
    method: 'post',
    url: 'rule-manager/search-by-rule',
    data
  });
}

// 获取内容
export function getContent(data: any) {
  return request<ContentResponse>({
    method: 'post',
    url: 'rule-manager/content',
    data
  });
}

// 获取内容
export function getContentByRule(data: any) {
  return request({
    method: 'post',
    url: 'rule-manager/content-by-rule',
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

// 获取章节
export function getChapterByRule(data: any) {
  return request({
    method: 'post',
    url: 'rule-manager/chapter-by-rule',
    data
  });
}

export function analyzerText(data: any) {
  return request({
    method: 'post',
    url: 'rule-manager/analyzer-text',
    data
  });
}

export function analyzerUrl(data: any) {
  return request({
    method: 'post',
    url: 'rule-manager/analyzer-url',
    data
  });
}

export function contentDecoder(data: any) {
  return request({
    method: 'post',
    url: 'rule-manager/content-decoder',
    data
  });
}
