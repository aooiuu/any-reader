import vm from 'node:vm'

/**
 * 运行 JS 脚本
 *
 * @param code 代码
 * @param context 上下文
 * @returns
 */
export function runjs(code: string, context: any = {}) {
  return vm.runInContext(code, vm.createContext(context))
}
