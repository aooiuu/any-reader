import { DataSource } from 'typeorm'
import { DB_PATH } from './constants'
import { ChapterHistory } from './entity/ChapterHistory'
import { ResourceHistory } from './entity/ResourceHistory'
import { ResourceFavorites } from './entity/ResourceFavorites'
import { ResourceRule } from './entity/ResourceRule'
import { RuleExtra } from './entity/RuleExtra'
import { ChapterHistoryService } from './service/ChapterHistory'
import { ResourceHistoryService } from './service/ResourceHistory'
import { ResourceFavoritesService } from './service/ResourceFavorites'
import { ResourceRuleService } from './service/ResourceRuleService'

export class DB {
  private _initialize = false
  private dataSource: DataSource

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource
  }

  async initialize() {
    if (this._initialize)
      return
    this._initialize = true
    return this.dataSource.initialize()
  }

  getChapterHistory() {
    return new ChapterHistoryService(this.dataSource.getRepository(ChapterHistory))
  }

  getResourceHistory() {
    return new ResourceHistoryService(this.dataSource.getRepository(ResourceHistory))
  }

  getResourceFavorites() {
    return new ResourceFavoritesService(this.dataSource.getRepository(ResourceFavorites))
  }

  getResourceRule() {
    return new ResourceRuleService(this.dataSource.getRepository(ResourceRule), this.dataSource.getRepository(RuleExtra))
  }
}

export function createDB(params: { dataSourceOptions?: any } = { }) {
  const commonConfig = {
    entityPrefix: 'ar_',
    synchronize: true,
    logging: true,
    entities: [ChapterHistory, ResourceHistory, ResourceFavorites, ResourceRule, RuleExtra],
  }
  if (params.dataSourceOptions) {
    const AppDataSource = new DataSource({
      ...commonConfig,
      ...params.dataSourceOptions,
      type: 'sqljs',
      location: DB_PATH,
      autoSave: true,
    })
    return new DB(AppDataSource)
  }
  else {
    const AppDataSource = new DataSource({
      ...commonConfig,
      type: 'sqlite',
      database: DB_PATH,
      subscribers: [],
      migrations: [],
    })
    return new DB(AppDataSource)
  }
}
