import vm from 'node:vm'
import type { Rule } from '@any-reader/rule-utils'
import { AnalyzerXPath } from '../analyzer/AnalyzerXPath'
import { JsVmException } from '../exception/JsVmException'
import { __http__ } from './request'

export class JSEngine {
  static environment: any = {}

  static setEnvironment(env: Record<string, any>) {
    Object.assign(JSEngine.environment || { }, env)
  }

  static evaluate(command: string, context: any = {}) {
    const { rule } = JSEngine.environment
    if (rule?.loadJs)
      command = `${rule.loadJs};${command}`
    try {
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
          return await analyzer.getStringList(xpath)
        },
      }))
    }
    catch (error) {
      throw new JsVmException(String(error))
    }
  }
}
