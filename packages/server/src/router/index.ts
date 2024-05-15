import Router from 'koa-router'
import { favoritesManager, historyManager, ruleFileManager } from '@any-reader/shared'
import { ContentType, RuleManager } from '@any-reader/core'
import * as localBookManager from '@any-reader/shared/localBookManager'

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

router.get('/getLocalBooks', async (ctx) => {
  ctx.body = success(await localBookManager.getBookList())
})

router.get('/getHistory', async (ctx) => {
  ctx.body = success(await historyManager.list())
})

router.post('/getChapter', async (ctx) => {
  const { filePath = '', ruleId = undefined } = ctx.request.body
  if (ruleId) {
    const rule = await ruleFileManager.findById(ruleId)
    const rm = new RuleManager(rule)
    const list = await rm.getChapter(filePath)
    ctx.body = success(
      list.map(e => ({
        ...e,
        name: e.name,
        path: e.url,
      })),
    )
    return
  }
  // 本地
  ctx.body = success(await localBookManager.getChapter(filePath))
})

router.post('/content', async (ctx) => {
  const { filePath, chapterPath, ruleId } = ctx.request.body
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

    ctx.body = success({
      content: text,
    })
    return
  }
  // 本地
  const content = await localBookManager.getContent(toBookChapter(filePath, chapterPath))
  ctx.body = success({
    content,
  })
})

/**
 * 转换为 BookChapter
 * @param filePath 文件路径
 * @param chapterPath 章节路径
 * @returns
 */
function toBookChapter(filePath: string, chapterPath: string) {
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
