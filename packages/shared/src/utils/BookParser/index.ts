import path from 'node:path'
import EPubBookParser from './parsers/EPubBookParser'
import TXTBookParser from './parsers/TXTBookParser'

export * from './types'

export function createBookParser(filePath: string) {
  return path.extname(filePath) === '.txt' ? new TXTBookParser(filePath) : new EPubBookParser(filePath)
}
