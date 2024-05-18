import Router from 'koa-router'
import { api } from '@any-reader/shared'
import type { Rule } from '@any-reader/core'

export const router = new Router()

function success(data: any, msg = '') {
  return {
    code: 0,
    data,
    msg,
  }
}

// 获取全部规则
router.get('/rules', async (ctx) => {
  ctx.body = success(api.rules())
})

// 获取单个规则
router.get('/getRuleById', async (ctx) => {
  ctx.body = success(api.getRuleById(ctx.query.id as string))
})

// 添加单个规则
router.post('/createRule', async (ctx) => {
  const rule: Rule = ctx.request.body
  await api.createRule(rule)
  ctx.body = success(rule)
})

// 更新规则
router.post('/updateRule', async (ctx) => {
  const rule: Rule = ctx.request.body
  await api.updateRule(rule)
  ctx.body = success(rule)
})

// 根据规则搜索
router.post('/searchByRuleId', async (ctx) => {
  const { ruleId, keyword } = ctx.request.body
  ctx.body = success(await api.searchByRuleId({ ruleId, keyword }).catch(() => []))
})

// 获取收藏列表
router.get('/getFavorites', async (ctx) => {
  ctx.body = success(await api.getFavorites())
})

router.get('/getLocalBooks', async (ctx) => {
  ctx.body = success(await api.getLocalBooks())
})

router.get('/getHistory', async (ctx) => {
  ctx.body = success(await api.getHistory())
})

router.post('/getChapter', async (ctx) => {
  const { filePath = '', ruleId = undefined } = ctx.request.body
  ctx.body = success(await api.getChapter({ filePath, ruleId }).catch(() => []))
})

router.post('/content', async (ctx) => {
  const { filePath, chapterPath, ruleId } = ctx.request.body
  ctx.body = success(await api.content({ filePath, chapterPath, ruleId }))
})

router.get('/discoverMap', async (ctx) => {
  const { ruleId } = ctx.query
  ctx.body = success(await api.discoverMap(ruleId as string))
})

router.post('/discover', async (ctx) => {
  const { ruleId, data } = ctx.request.body
  ctx.body = success(await api.discover({ ruleId, data }))
})
