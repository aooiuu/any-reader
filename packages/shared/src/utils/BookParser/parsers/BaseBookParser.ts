import path from 'node:path'

export class BaseBookParser {
  protected filePath: string

  constructor(filePath: string) {
    this.filePath = filePath
  }

  get path() {
    return this.filePath
  }

  get name() {
    return path.basename(this.filePath, path.extname(this.filePath))
  }
}
