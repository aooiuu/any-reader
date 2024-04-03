import { HISTORY_PATH } from './constants'
import { RecordFile } from './RecordFile'

export const historyManager = new RecordFile(HISTORY_PATH)
