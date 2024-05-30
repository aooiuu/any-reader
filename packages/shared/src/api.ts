// @ts-expect-error
import { ensureFile, readJson, writeJson } from 'fs-extra/esm'
import type { Rule } from '@any-reader/core'
import { ContentType, RuleManager } from '@any-reader/core'
import * as ruleFileManager from './ruleFileManager'
import * as ruleExtraManager from './ruleExtraManager'
import { favoritesManager } from './favoritesManager'
import { historyManager } from './historyManager'
import type { BookChapter } from './localBookManager'
import localBookManager from './localBookManager'

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
export function getLocalBooks(dir: string) {
  return localBookManager.getBookList(dir)
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

export function batchUpdateRules(data: { ids: string[]; rule: Rule }) {
  return ruleFileManager.batchUpdate(data)
}

/**
 * 根据规则ID获取规则
 * @param ruleId
 * @returns
 */
export async function getRuleById(ruleId: string) {
  const rules = await ruleFileManager.list()
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
  return await analyzer.search(keyword).catch(() => [])
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
    const content: string[] = await rm.getContent(chapterPath).catch(() => [])
    let text = ''
    if (rule.contentType === ContentType.MANGA)
      text = content.map(src => `<img src="${src}"/>`).join('')
    else if (rule.contentType === ContentType.VIDEO)
      text = content?.[0] || ''
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
    const list = await rm.getChapter(filePath).catch(() => [])
    return list.map(e => ({
      ...e,
      name: e.name,
      chapterPath: e.url,
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
function toBookChapter(filePath: string, chapterPath: string): BookChapter {
  return {
    name: '',
    chapterPath,
    filePath,
  }
}

export async function readConfig(filePath: string) {
  await ensureFile(filePath)
  return await readJson(filePath).catch(() => ({}))
}

export async function updateConfig(filePath: string, data: any) {
  await ensureFile(filePath)
  writeJson(filePath, data, { spaces: 2 })
}

export function getRuleExtras() {
  return ruleExtraManager.getRuleExtras()
}

export function ping(data: { id: string; host: string }) {
  return ruleExtraManager.ping(data.id, data.host)
}

// 删除规则
export async function delRules(data: { id: string[] }) {
  await ruleFileManager.del(data.id, true)
}

// 更新排序
export async function updateRuleSort({ id }: { id: string[] }) {
  ruleFileManager.updateRuleSort(id)
}

function success(data: any, msg = '') {
  return {
    code: 0,
    data,
    msg,
  }
}

// vscode 、electron、服务端通用注册接口
export function useApi(register: any, { CONFIG_PATH, bookDir }: any) {
  register('get@discoverMap', async ({ ruleId = '' } = {}) => success(await discoverMap(ruleId)))
  register('get@getFavorites', async () => success(await getFavorites()))
  register('get@getHistory', async () => success(await getHistory()))
  register('get@getLocalBooks', async () => success(await getLocalBooks(bookDir)))
  register('post@discover', async (data: any) => success(await discover(data)))
  register('post@star', async (data: any) => success(await star(data)))
  register('post@unstar', async (data: any) => success(await unstar(data)))
  register('get@rules', async () => success(await rules()))
  register('get@getRuleById', async ({ id = '' } = {}) => success(await getRuleById(id)))
  register('post@createRule', async (data: any) => success(await createRule(data)))
  register('post@updateRule', async (data: any) => success(await updateRule(data)))
  register('post@searchByRuleId', async (data: any) => success(await searchByRuleId(data)))
  register('post@content', async (data: any) => success(await content(data)))
  register('post@getChapter', async (data: any) => success(await getChapter(data)))
  register('get@readConfig', async () => success(await readConfig(CONFIG_PATH)))
  register('post@updateConfig', async (data: any) => success(await updateConfig(CONFIG_PATH, data)))
  register('get@getRuleExtras', async () => success(await getRuleExtras()))
  register('post@ping', async (data: any) => success(await ping(data)))
  register('post@batchUpdateRules', async (data: any) => success(await batchUpdateRules(data)))
  register('post@delRules', async (data: any) => success(await delRules(data)))
  register('post@updateRuleSort', async (data: any) => success(await ruleFileManager.updateRuleSort(data && data.id)))
}
