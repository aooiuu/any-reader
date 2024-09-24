import vm from 'node:vm';
import { JsVmException } from '../exception/JsVmException';
import { JSEngine as BaseJSEngine } from '../sandbox/JSEngine';
import { injectJs } from '../utils/inject-js';

export class JSEngine extends BaseJSEngine {
  static environment: any = {};
  static VMCtx: any;

  static setEnvironment(env: Record<string, any>) {
    Object.assign(JSEngine.environment || {}, env);
  }

  static init() {
    JSEngine.VMCtx = vm.createContext(
      Object.assign(Object.create(null), injectJs(JSEngine.environment.rule), {
        window: {}
      })
    );
  }

  static async evaluate(command: string, context: any = {}) {
    if (!JSEngine.VMCtx) JSEngine.init();
    const { rule } = JSEngine.environment;
    let scripts = '';
    if (rule?.loadJs) scripts += rule.loadJs + ';';
    scripts += command + ';';
    try {
      const p = vm.runInContext(scripts, Object.assign(JSEngine.VMCtx, JSEngine.environment, context));
      return typeof p === 'object' && typeof p.then === 'function' ? await p : p;
    } catch (error) {
      throw new JsVmException(String(error));
    }
  }
}
