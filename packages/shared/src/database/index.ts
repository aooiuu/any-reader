// import 'reflect-metadata'

import { AppDataSource } from './data-source'
import { ChapterHistory } from './entity/ChapterHistory'
import { ChapterHistoryService } from './service/ChapterHistory'

class DB {
  private _initialize = false

  async initialize() {
    if (this._initialize)
      return
    this._initialize = true
    return AppDataSource.initialize()
  }

  getChapterHistory() {
    return new ChapterHistoryService(AppDataSource.getRepository(ChapterHistory))
  }
}

export const db = new DB()
