import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import createPlugins from './vite/plugins';
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  let outDir = 'dist/web';
  if (env.VITE_APP_PLATFORM === 'browser') {
    outDir = '../server/public';
  } else if (env.VITE_APP_PLATFORM === 'vscode') {
    outDir = '../vscode/template-dist';
  } else if (env.VITE_APP_PLATFORM === 'electron') {
    outDir = 'dist/electron-template';
  }

  return {
    plugins: createPlugins(env),
    base: './',
    server: {
      port: 8899
    },
    build: {
      outDir
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  };
});
