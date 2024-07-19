import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/extension.ts'],
  external: [
    'vscode'

    // /original-fs/
  ],
  format: 'cjs',
  minify: true,
  shims: true,
  sourcemap: true
});
