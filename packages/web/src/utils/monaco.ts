import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import 'monaco-editor/esm/vs/language/json/monaco.contribution';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === 'json') {
      return new jsonWorker();
    }
    return new editorWorker();
  }
};

export { monaco };
