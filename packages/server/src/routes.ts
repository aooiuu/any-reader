import Router from 'koa-router'
import bcrypt from 'bcryptjs'
import type { App } from '@any-reader/shared'

export function createRoute(api: App) {
  const router = new Router()

  router.post('/login', (ctx) => {
    const passwordConf = api.config.password
    if (!passwordConf) {
      ctx.body = {
        code: 10001,
      }
      return
    }
    const { password } = ctx.request.body
    if (bcrypt.compareSync(password, passwordConf)) {
      ctx.session!.uid = 1
      ctx.body = {
        code: 0,
      }
    }
    else {
      ctx.body = {
        code: -1,
        msg: '密码错误',
      }
    }
  })

  router.get('/logout', (ctx) => {
    ctx.session!.uid = null
    ctx.body = {
      code: 0,
    }
  })

  router.post('/install', (ctx) => {
    const passwordConf = api.config.password
    if (passwordConf) {
      ctx.body = {
        code: 10002,
        msg: '已经设置过密码',

      }
      return
    }
    const { password } = ctx.request.body
    api.updateConfig({
      password,
    })
    ctx.session!.uid = 1
    ctx.body = {
      code: 0,
    }
  })

  api.useApi(
    async (path: string, cb: any) => {
      if (typeof path !== 'string')
        return
      const paths = path.split('@')
      if (paths.length !== 2)
        return
      const method = paths[0].toLocaleLowerCase() as 'post' | 'get'
      router[method](`/${paths[1]}`, async (ctx) => {
        const data = method === 'get' ? ctx.query : ctx.request.body
        ctx.body = await cb(data)
      })
    })

  return router
}
