import * as path from 'node:path'
import type { BookParser } from './BookParser'
import EPubBookParser from './EPubBookParser'
import TXTBookParser from './TXTBookParser'

export * from './BookParser'

export {
  EPubBookParser,
  TXTBookParser,
}

export function getBookParser(filePath: string): BookParser {
  if (path.extname(filePath) === '.txt')
    return new TXTBookParser(filePath)
  return new EPubBookParser(filePath)
}
