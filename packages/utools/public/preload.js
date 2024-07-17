const path = require('node:path')
const os = require('node:os')
const createApp = require('./libs')

const ROOT_PATH = path.join(os.homedir(), '.any-reader')
const CONFIG_PATH = path.join(ROOT_PATH, 'config.desktop.json')

window.$AnyReader = {
  _api: {},

  async request(params) {
    const fn = window.$AnyReader._api[params.url]
    if (!fn)
      return
    return await fn(params.data)
  },
}

const api = createApp({
  configPath: CONFIG_PATH,
})

api.useApi(async (path, cb) => {
  window.$AnyReader._api[path] = cb
})
