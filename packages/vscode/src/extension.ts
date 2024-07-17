import { ExtensionContext } from 'vscode';

export async function activate(context: ExtensionContext) {
  console.log(`extensionPath: ${context.extensionPath}`);
  const { app } = await import('./App');
  app.activate(context);
}

export function deactivate() {}
