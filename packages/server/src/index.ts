import path, { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as os from 'node:os'
import Koa from 'koa'
import { bodyParser } from '@koa/bodyparser'
import cors from '@koa/cors'
import serve from 'koa-static'
import session from 'koa-session'
import { Api } from '@any-reader/shared'
import { createRoute } from './routes'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.resolve(path.dirname(__filename), '..')

const ROOT_PATH = path.join(os.homedir(), '.any-reader')
const CONFIG_PATH = path.join(ROOT_PATH, 'config.desktop.json')

const app = new Koa()

export async function start(port = 8898, root = resolve(__dirname, 'public')) {
  const api = new Api({
    configPath: CONFIG_PATH,
  })
  const router = createRoute(api)
  app.keys = ['any-reader']
  const SESSION_CONFIG = {
    key: 'any-reader',
    maxAge: 24 * 60 * 60 * 1000 * 7,
    httpOnly: true,
    // rolling: true
  }

  app
    .use(session(SESSION_CONFIG, app))
    .use(async (ctx, next) => {
      if (ctx.session!.uid || ['/favicon.ico', '/login', '/install', '/', 'index.html'].includes(ctx.path)
      || /^\/assets\//.test(ctx.path)) {
        await next()
        return
      }
      // 没有登录
      const password = api.config.password
      // 没有设置密码
      if (!password) {
        ctx.body = {
          code: 10001,
        }
        return
      }
      // 设置了密码
      ctx.body = {
        code: 401,
      }
    })
    .use(bodyParser())
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(serve(root))
    .listen(port)
}
