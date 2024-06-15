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

// 获取历史
export function getHistory() {
  return request({
    method: 'get',
    url: 'getHistory'
  });
}

// 获取本地
export function getLocalBooks() {
  return request({
    method: 'get',
    url: 'getLocalBooks'
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

// 获取内容
export function getContent(data: any) {
  return request({
    method: 'post',
    url: 'content',
    data
  });
}

// 获取章节
export function getChapter(filePath: string, ruleId?: string) {
  return request({
    method: 'post',
    url: 'getChapter',
    data: {
      filePath,
      ruleId
    }
  });
}

// 获取配置
export function readConfig() {
  return request({
    method: 'get',
    url: 'readConfig'
  });
}

// 更新配置
export function updateConfig(data: any) {
  return request({
    method: 'post',
    url: 'updateConfig',
    data
  });
}

// 获取扩展数据
export function getRuleExtras() {
  return request({
    method: 'get',
    url: 'getRuleExtras'
  });
}

// 测速
export function ping(data: any) {
  return request({
    method: 'post',
    url: 'ping',
    data
  });
}

// 批量更新规则
export function batchUpdateRules(data: any) {
  return request({
    method: 'post',
    url: 'batchUpdateRules',
    data
  });
}

// 删除规则
export function delRules(data: any) {
  return request({
    method: 'post',
    url: 'delRules',
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

// 导入规则
export function importRules(data: any) {
  return request({
    method: 'post',
    url: 'importRules',
    data
  });
}

// 删除历史
export function removeHistory(data: { ruleId: string; url: string }) {
  return request({
    method: 'post',
    url: 'history/remove',
    data
  });
}

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
