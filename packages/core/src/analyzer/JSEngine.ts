import vm from 'node:vm'
import type { Rule } from '../index'

export class JSEngine {
  static environment = {}

  static setEnvironment(env: {
    page: number
    rule: Rule
    result: string
    baseUrl: string
    keyword: string
    lastResult: string
  }) {
    const {
      page = 1,
      rule,
      result = '',
      baseUrl = '',
      keyword = '',
      lastResult = '',
    } = env

    JSEngine.environment = {
      page,
      rule,
      result,
      baseUrl,
      keyword,
      lastResult,
      host: rule.host,
      cookie: rule.cookies,
    }
  }

  static async evaluate(command: string, context: any = {}) {
    return vm.runInNewContext(command, vm.createContext({
      ...JSEngine.environment,
      ...context,
    }))
  }
}
