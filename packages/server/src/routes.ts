import Router from 'koa-router'
import { CONSTANTS, api } from '@any-reader/shared'

export const router = new Router()

api.useApi(
  async (path: string, cb: any) => {
    if (path.startsWith('get')) {
      router.get(path.replace(/get@/, '/'), async (ctx) => {
        ctx.body = await cb(ctx.query)
      })
    }
    else if (path.startsWith('post')) {
      router.get(path.replace(/post@/, '/'), async (ctx) => {
        ctx.body = await cb(ctx.request.body)
      })
    }
  },
  {
    CONFIG_PATH: '',
    bookDir: CONSTANTS.LOCAL_BOOK_DIR,
  })
