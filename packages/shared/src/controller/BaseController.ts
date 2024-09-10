import { createRuleManager } from '@any-reader/core';
import type { App } from '../app';
import { Rule } from '@any-reader/rule-utils';

export class BaseController {
  private _app: App;
  constructor(app: App) {
    this._app = app;
  }

  get analyzerManager() {
    return this._app.analyzerManager;
  }

  createRuleManager(rule: Rule) {
    return createRuleManager(rule, this._app.analyzerManager);
  }

  get app() {
    return this._app;
  }

  get db() {
    return this.app.db;
  }
}
