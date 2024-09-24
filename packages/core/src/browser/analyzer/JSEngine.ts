import { injectJs } from '../../utils/inject-js';
import { JSEngine as BaseJSEngine } from '../../sandbox/JSEngine';

export class JSEngine extends BaseJSEngine {
  static environment: any = {};
  static VMCtx: any;

  static setEnvironment(env: Record<string, any>) {
    Object.assign(JSEngine.environment, env);
  }

  static init() {
    JSEngine.VMCtx = Object.create(null);
    Object.assign(JSEngine.VMCtx, injectJs(JSEngine.environment.rule));
  }

  static async evaluate(command: string, context: any = {}) {
    if (!JSEngine.VMCtx) JSEngine.init();
    const { rule } = JSEngine.environment;
    let scripts = '';
    if (rule?.loadJs) scripts += rule.loadJs + ';';
    scripts += command + ';';
    Object.assign(JSEngine.VMCtx, JSEngine.environment, context);
    const field = '__AnyReaderVM';
    (window as any)[field] = JSEngine.VMCtx;
    // 处理作用域
    const code = `(function(window, self, globalThis){with(window){;return ${scripts}}}).bind(window.${field})(window.${field}, window.${field}, window.${field});`;
    return (0, eval)(`(function(){return ${code}})`).call(window);
  }
}
