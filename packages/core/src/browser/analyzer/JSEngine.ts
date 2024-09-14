import { JSEngine as BaseJSEngine } from '../../sandbox/JSEngine';

// TODO: JSEngine
export class JSEngine extends BaseJSEngine {
  static setEnvironment() {}

  static init() {}

  static async evaluate(command: string, _context: any = {}) {
    return eval(command);
  }
}
