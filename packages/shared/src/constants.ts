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
// 缓存目录
export const CACHE_DIR = path.join(ROOT_PATH, '.cache')
// 规则扩展数据
export const RULE_EXTRA_PATH = path.join(ROOT_PATH, 'source.extra.json')
// 数据库路径
export const DB_PATH = path.join(ROOT_PATH, 'data.db')
