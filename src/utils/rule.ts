import { toByteArray } from 'base64-js'
import { inflate } from 'pako'

export function decodeRule(text: string) {
  const lastIndex = text.lastIndexOf('@')
  const gzipBytes = toByteArray(text.substring(lastIndex + 1))
  return JSON.parse(inflate(gzipBytes, { to: 'string' }))
}
