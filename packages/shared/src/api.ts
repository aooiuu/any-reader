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
 * 发现页列表
 * @returns
 */
export async function discover({ ruleId, data }: any) {
  const rule = await ruleFileManager.findById(ruleId)
  const ruleManager = new RuleManager(rule)
  return ruleManager.discover(data.value)
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
  const registerApi = async (apiPath: string, handle: Function, log?: {
    ruleId: (...arg: any) => string
    check: (arg: any) => boolean
  }) => {
    register(apiPath, async (...arg: any) => {
      // 原始返回值
      const result = await handle(...arg).catch(() => {})

      // 记录接口调用情况
      if (typeof log === 'object' && log.ruleId && log.check) {
        const ruleId = log.ruleId(...arg)

        // 不记录没有规则ID的接口
        if (ruleId) {
          const isOk = log.check(result)
          ruleExtraManager.updateApiStatus(ruleId, isOk ? `${apiPath}.ok` : `${apiPath}.fail`)
        }
      }

      // 返回数据
      return success(result)
    })
  }

  const discoverLog = {
    ruleId: (data: any) => data.ruleId,
    check: (v: any[]) => Array.isArray(v) && v.length > 0,
  }

  const contentLog = {
    ruleId: (data: any) => data.ruleId,
    check: (v: any) => v?.content?.length > 0,
  }

  // 注册接口
  registerApi('get@discoverMap', async ({ ruleId = '' } = {}) => await discoverMap(ruleId), discoverLog)
  registerApi('post@discover', async (data: any) => await discover(data), discoverLog)
  registerApi('get@getFavorites', async () => await getFavorites())
  registerApi('get@getHistory', async () => await getHistory())
  registerApi('get@getLocalBooks', async () => await getLocalBooks(bookDir))
  registerApi('post@star', async (data: any) => await star(data))
  registerApi('post@unstar', async (data: any) => await unstar(data))
  registerApi('get@rules', async () => await rules())
  registerApi('get@getRuleById', async ({ id = '' } = {}) => await getRuleById(id))
  registerApi('post@createRule', async (data: any) => await createRule(data))
  registerApi('post@updateRule', async (data: any) => await updateRule(data))
  registerApi('post@searchByRuleId', async (data: any) => await searchByRuleId(data), discoverLog)
  registerApi('post@content', async (data: any) => await content(data), contentLog)
  registerApi('post@getChapter', async (data: any) => await getChapter(data), discoverLog)
  registerApi('get@readConfig', async () => await readConfig(CONFIG_PATH))
  registerApi('post@updateConfig', async (data: any) => await updateConfig(CONFIG_PATH, data))
  registerApi('get@getRuleExtras', async () => await getRuleExtras())
  registerApi('post@ping', async (data: any) => await ping(data))
  registerApi('post@batchUpdateRules', async (data: any) => await batchUpdateRules(data))
  registerApi('post@delRules', async (data: any) => await delRules(data))
  registerApi('post@updateRuleSort', async (data: any) => await ruleFileManager.updateRuleSort(data && data.id))
  registerApi('post@importRules', async (data: any) => await ruleFileManager.importRules(data && data.url))
}
