import * as os from 'node:os'
import * as path from 'node:path'
import Router from 'koa-router'
import { CONSTANTS, api } from '@any-reader/shared'

export const router = new Router()

export const ROOT_PATH = path.join(os.homedir(), '.any-reader')
export const CONFIG_PATH = path.join(ROOT_PATH, 'config.desktop.json')

api.useApi(
  async (path: string, cb: any) => {
    if (typeof path !== 'string')
      return
    const paths = path.split('@')
    if (paths.length !== 2)
      return
    const method = paths[0] as 'post' | 'get'
    router[method](`/${paths[1]}`, async (ctx) => {
      const data = method === 'get' ? ctx.query : ctx.request.body
      ctx.body = await cb(data)
    })
  },
  {
    CONFIG_PATH,
    bookDir: CONSTANTS.LOCAL_BOOK_DIR,
  })
