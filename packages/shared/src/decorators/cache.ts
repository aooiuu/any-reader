import * as fs from 'node:fs'
import * as path from 'node:path'

// @ts-expect-error
import { ensureFileSync } from 'fs-extra/esm'
import { CACHE_DIR } from '../constants'
import { createCacheDecorator } from './create-cache-decorator'

function getCachePath(key: string) {
  return path.join(CACHE_DIR, key)
}

export const Cacheable = createCacheDecorator<any>({
  getItem: async (key: string) => {
    const cachePath = getCachePath(key)
    if (!fs.existsSync(cachePath))
      return
    return JSON.parse(fs.readFileSync(cachePath, 'utf-8'))
  },
  setItem: async (key: string, value: any) => {
    const cachePath = getCachePath(key)
    ensureFileSync(cachePath)
    fs.writeFileSync(cachePath, JSON.stringify(value), 'utf-8')
  },
})
