import { workspace } from 'vscode';

export type ReadPageMode = 'Editor' | 'Sidebar';

function store() {
  return workspace.getConfiguration('any-reader');
}

export class Config {
  static get readPageMode(): ReadPageMode {
    return store().get('read-page-mode') as ReadPageMode;
  }

  set readPageMode(v: ReadPageMode) {
    store().update('read-page-mode', v);
  }
}
