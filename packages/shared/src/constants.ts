import * as os from 'node:os'
import * as path from 'node:path'

export const ROOT_PATH = path.join(os.homedir(), '.any-reader')

// 规则路径
export const BOOK_SOURCE_PATH = path.join(ROOT_PATH, 'book-source.json')
// 历史记录路径
export const HISTORY_PATH = path.join(ROOT_PATH, 'history.json')
// 收藏配置路径
export const FAVORITES_PATH = path.join(ROOT_PATH, 'favorites.json')
// 本地文件目录
export const LOCAL_BOOK_DIR = path.join(ROOT_PATH, 'local-book')
