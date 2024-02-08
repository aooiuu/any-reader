import { ExtensionContext } from 'vscode';
import { app } from './App';

export function activate(context: ExtensionContext) {
  app.activate(context);
}

export function deactivate() {}
