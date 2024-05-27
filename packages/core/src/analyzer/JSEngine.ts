import vm from 'node:vm'
import { AnalyzerXPath } from '../analyzer/AnalyzerXPath'
import type { Rule } from '../index'
import { __http__ } from './AnalyzerUrl'

export class JSEngine {
  static environment: any = {}

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

      // 处理 eso 规则中的注入JS
      __http__: (url: string) => {
        return __http__(url, JSEngine.environment.rule as Rule)
      },
      http: (url: string) => {
        return __http__(url, JSEngine.environment.rule as Rule)
      },
      xpath: async (html: string, xpath: string): Promise<string[]> => {
        const analyzer = new AnalyzerXPath()
        analyzer.parse(html)
        return await analyzer.getStringList(xpath).catch(() => [])
      },
    }))
  }
}
