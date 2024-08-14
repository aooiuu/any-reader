import type { App } from '../app';

export class BaseController {
  private _app: App;
  constructor(app: App) {
    this._app = app;
  }

  get app() {
    return this._app;
  }

  get db() {
    return this.app.db;
  }
}
