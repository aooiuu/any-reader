import type { Rule } from '@any-reader/core'
import { ContentType, RuleManager } from '@any-reader/core'
import * as ruleFileManager from './ruleFileManager'
import { favoritesManager } from './favoritesManager'
import { historyManager } from './historyManager'
import * as localBookManager from './localBookManager'

// 初始化
export async function init() {
  return Promise.all([
    ruleFileManager.init(),
    favoritesManager.init(),
    historyManager.init(),
  ])
}

// 发现页分类
export async function discoverMap(ruleId: string) {
  const rule = await ruleFileManager.findById(ruleId)
  const ruleManager = new RuleManager(rule)
  return ruleManager.discoverMap()
}

/**
 * 收藏列表
 * @returns
 */
export function getFavorites() {
  return favoritesManager.list()
}

/**
 * 历史记录
 * @returns
 */
export function getHistory() {
  return historyManager.list()
}

/**
 * 本地书籍
 * @returns
 */
export function getLocalBooks() {
  return localBookManager.getBookList()
}

/**
 * 发现页列表
 * @returns
 */
export async function discover({ ruleId, data }: any) {
  const rule = await ruleFileManager.findById(ruleId)
  const ruleManager = new RuleManager(rule)
  return ruleManager.discover(data.value)
}

/**
 * 收藏
 * @param param0
 * @returns
 */
export async function star({ data, ruleId }: any) {
  await favoritesManager.add(data, await ruleFileManager.findById(ruleId))
  return true
}

/**
 * 取消收藏
 * @returns
 */
export async function unstar({ data, ruleId }: any) {
  await favoritesManager.del(data, await ruleFileManager.findById(ruleId))
  return true
}

/**
 * 规则列表
 * @returns
 */
export function rules() {
  return ruleFileManager.list()
}

/**
 * 根据规则ID获取规则
 * @param ruleId
 * @returns
 */
export function getRuleById(ruleId: string) {
  const rules = ruleFileManager.list()
  return rules.find(e => e.id === ruleId)
}

/**
 * 创建规则
 * @param data
 * @returns
 */
export function createRule(data: Rule) {
  return ruleFileManager.update(data)
}

/**
 * 更新规则
 * @param data
 * @returns
 */
export async function updateRule(data: Rule) {
  await ruleFileManager.update(data)
  return data
}

/**
 * 搜索
 * @returns
 */
export async function searchByRuleId({ ruleId, keyword }: { ruleId: string; keyword: string }) {
  const rule = await ruleFileManager.findById(ruleId)
  const analyzer = new RuleManager(rule)
  return analyzer.search(keyword)
}

/**
 * 获取内容
 * @param param0
 * @returns
 */
export async function content({ filePath, chapterPath, ruleId }: any) {
  // 在线
  if (ruleId) {
    const rule = await ruleFileManager.findById(ruleId)
    const rm = new RuleManager(rule)
    const content = await rm.getContent(chapterPath)
    let text = ''
    if (rule.contentType === ContentType.MANGA)
      text = content.map(src => `<img src="${src}"/>`).join('')

    else
      text = content.join('')

    return {
      content: text,
    }
  }
  // 本地
  const content = await localBookManager.getContent(toBookChapter(filePath, chapterPath))
  return {
    content,
  }
}

/**
 * 获取章节列表
 * @returns
 */
export async function getChapter({ filePath = '', ruleId = undefined } = {}) {
  if (ruleId) {
    const rule = await ruleFileManager.findById(ruleId)
    const rm = new RuleManager(rule)
    const list = await rm.getChapter(filePath)
    return list.map(e => ({
      ...e,
      name: e.name,
      path: e.url,
    }),
    )
  }
  // 本地
  return localBookManager.getChapter(filePath)
}

/**
 * 转换为 BookChapter
 * @param filePath 文件路径
 * @param chapterPath 章节路径
 * @returns
 */
function toBookChapter(filePath: string, chapterPath: string): localBookManager.BookChapter {
  return {
    file: {
      path: filePath,
      type: localBookManager.getBookType(filePath),
      name: '',
    },
    name: '',
    path: chapterPath,
  }
}
