import path, { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Koa from 'koa'
import { bodyParser } from '@koa/bodyparser'
import cors from '@koa/cors'
import serve from 'koa-static'
import { api } from '@any-reader/shared'
import { router } from './routes'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.resolve(path.dirname(__filename), '..')

const app = new Koa()

export async function start(port = 8898, root = resolve(__dirname, 'public')) {
  await api.init()
  app
    .use(bodyParser())
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(serve(root))
    .listen(port)
}
