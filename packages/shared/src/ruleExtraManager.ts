// @ts-expect-error
import { readJson } from 'fs-extra/esm'
import _ from 'lodash-es'
import { JSONFilePreset } from 'lowdb/node'
import type { Low } from 'lowdb/lib'
import { RULE_EXTRA_PATH } from './constants'
import _ping from './ping'

export interface SourceExtraRow {
  [_: string]: number
}

export interface SourceExtra {
  [_: string]: SourceExtraRow
}

let mDb: Low<SourceExtra>

async function getDb() {
  if (mDb)
    return mDb
  const data = await readJson(RULE_EXTRA_PATH).catch(() => ({}))
  mDb = await JSONFilePreset<SourceExtra>(RULE_EXTRA_PATH, data)
  return mDb
}

const writeDB = _.throttle(async () => {
  const db = await getDb()
  db.write()
}, 1000)

export async function ping(id: string, host: string) {
  const db = await getDb()
  if (!db.data[id])
    db.data[id] = {}
  db.data[id].ping = await _ping(host)
  writeDB()
  return db.data[id]
}

export async function getExtraInfoById(id: string): Promise<SourceExtraRow> {
  const db = await getDb()
  return db.data[id]
}

export async function getRuleExtras(): Promise<SourceExtra> {
  const db = await getDb()
  return db.data
}

export async function updateApiStatus(id: string, field: string) {
  const db = await getDb()
  if (!db.data[id])
    db.data[id] = {}
  _.set(db.data[id], field, _.get(db.data[id], field, 0) + 1)
  writeDB()
}
