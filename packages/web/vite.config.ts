import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import createPlugins from './vite/plugins';
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: createPlugins(),
    base: './',
    server: {
      port: 8899
    },
    build: {
      outDir: env.VITE_APP_PLATFORM === 'browser' ? '../server/public' : '../vscode/template-dist'
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  };
});
