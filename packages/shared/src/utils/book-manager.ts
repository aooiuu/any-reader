import * as path from 'node:path'
import * as fs from 'node:fs'
import { createBookParser } from './BookParser'

export * from './BookParser'

export async function getBookList(dir: string) {
  if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory())
    fs.mkdirSync(dir)

  return fs.readdirSync(dir)
    .filter(filePath => ['.txt', '.epub'].includes(path.extname(filePath)))
    .map((filePath) => {
      return createBookParser(path.join(dir, filePath))
    })
}
