import path, { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import open from 'open'
import { start } from '@any-reader/server'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.resolve(path.dirname(__filename), '..')

const port = 8898
start(port, resolve(__dirname, 'public'))
open(`http://localhost:${port}/`)
