// @ts-expect-error
import { ensureFile, readJson, writeJson } from 'fs-extra/esm'
import type { Rule, SearchItem } from '@any-reader/core'

export interface RecordFileRow extends SearchItem {
  ruleId: string
  createTime: number
}

const MAX_LENGTH = 100

export class RecordFile {
  filePath: string
  history: RecordFileRow[] = []

  constructor(filePath: string) {
    this.filePath = filePath
  }

  // 初始化
  async init() {
    await ensureFile(this.filePath)
    this.history = await readJson(this.filePath).catch(() => this.history)
  }

  // 获取所有记录
  async list() {
    return this.history
  }

  // 保存配置文件
  async writeFile() {
    await ensureFile(this.filePath)
    await writeJson(this.filePath, this.history, { spaces: 2 })
  }

  // 删除记录
  async del(item: SearchItem, rule: Rule, saveFile = true) {
    this.history = this.history.filter(e => !(e.ruleId === rule.id && e.url === item.url))
    if (saveFile)
      await this.writeFile()
  }

  // 添加记录
  async add(item: SearchItem, rule: Rule) {
    if (this.history.length > MAX_LENGTH)
      this.history.splice(MAX_LENGTH)

    this.del(item, rule, false)
    this.history.unshift({
      ...item,
      ruleId: rule.id,
      createTime: Date.now(),
    })
    await this.writeFile()
  }

  // 是否存在
  has(rule: Rule, url: string) {
    return this.history.find(e => e.ruleId === rule.id && e.url === url)
  }
}
