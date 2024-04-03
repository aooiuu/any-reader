import Router from 'koa-router'
import { favoritesManager, ruleFileManager } from '@any-reader/shared'
import { RuleManager } from '@any-reader/core'

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
  ctx.body = success(ruleFileManager.list())
})

// 获取单个规则
router.get('/getRuleById', async (ctx) => {
  const data = ctx.query
  const rules = ruleFileManager.list()
  ctx.body = success(rules.find(e => e.id === data.id))
})

// 添加单个规则
router.post('/createRule', async (ctx) => {
  const data = ctx.request.body
  await ruleFileManager.update(data)
  ctx.body = success(data)
})

// 更新规则
router.post('/updateRule', async (ctx) => {
  const data = ctx.request.body
  await ruleFileManager.update(data)
  ctx.body = success(data)
})

// 根据规则搜索
router.post('/searchByRuleId', async (ctx) => {
  const { ruleId, keyword } = ctx.request.body
  const rule = await ruleFileManager.findById(ruleId)
  const analyzer = new RuleManager(rule)
  ctx.body = success(await analyzer.search(keyword).catch(() => []))
})

// 获取收藏列表
router.get('/getFavorites', async (ctx) => {
  ctx.body = success(await favoritesManager.list())
})
