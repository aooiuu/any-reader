import { request } from '@/utils/request';

// 获取所有规则
export function getRules() {
  return request({
    method: 'get',
    url: 'rules'
  });
}

// 根据ID获取规则
export function getRuleById(id: string) {
  return request({
    method: 'get',
    url: 'getRuleById',
    params: { id }
  });
}

// 创建规则
export function createRule(data: any) {
  return request({
    method: 'post',
    url: 'createRule',
    data
  });
}

// 更新规则
export function updateRule(data: any) {
  return request({
    method: 'post',
    url: 'updateRule',
    data
  });
}

// 发现页分类列表
export function discoverMap(ruleId: string) {
  return request({
    method: 'get',
    url: 'discoverMap',
    params: {
      ruleId
    }
  });
}

// 发现页分类下内容
export function discover(data: any) {
  return request({
    method: 'post',
    url: 'discover',
    data
  });
}

// 获取收藏列表
export function getFavorites() {
  return request({
    method: 'get',
    url: 'getFavorites'
  });
}

// 收藏
export function star(data: any) {
  return request({
    method: 'post',
    url: 'star',
    data
  });
}

// 取消收藏
export function unstar(data: any) {
  return request({
    method: 'post',
    url: 'unstar',
    data
  });
}

// 根据规则ID搜索内容
export function searchByRuleId(data: { ruleId: string; keyword: string }) {
  return request({
    method: 'post',
    url: 'searchByRuleId',
    data
  });
}
