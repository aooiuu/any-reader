import path, { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Koa from 'koa'
import { bodyParser } from '@koa/bodyparser'
import cors from '@koa/cors'
import serve from 'koa-static'
import { favoritesManager, historyManager, ruleFileManager } from '@any-reader/shared'
import { router } from './router'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.resolve(path.dirname(__filename), '..')

const app = new Koa()

async function start() {
  await Promise.all([
    ruleFileManager.init(),
    favoritesManager.init(),
    historyManager.init(),
  ])
  app
    .use(bodyParser())
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(serve(resolve(__dirname, 'public')))
    .listen(8898)
}

start()
