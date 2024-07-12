import { DataSource } from 'typeorm'
import { DB_PATH } from '../constants'
import { ChapterHistory } from './entity/ChapterHistory'

export const AppDataSource = new DataSource({
  entityPrefix: 'ar_',
  type: 'sqlite',
  database: DB_PATH,
  synchronize: true,
  logging: true,
  entities: [ChapterHistory],
  subscribers: [],
  migrations: [],
})
