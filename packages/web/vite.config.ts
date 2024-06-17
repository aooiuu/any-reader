import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import createPlugins from './vite/plugins';

export type TPlatform = 'browser' | 'vscode' | 'electron' | 'utools';

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isBuild = command === 'build';
  const VITE_APP_PLATFORM = env.VITE_APP_PLATFORM as TPlatform;

  let outDir = 'dist/web';

  if (env.outDir) {
    outDir = env.outDir;
  } else {
    if (VITE_APP_PLATFORM === 'browser') {
      outDir = '../server/public';
    } else if (VITE_APP_PLATFORM === 'vscode') {
      outDir = '../vscode/template-dist';
    } else if (VITE_APP_PLATFORM === 'utools') {
      outDir = '../utools/public/template';
    } else if (VITE_APP_PLATFORM === 'electron') {
      outDir = 'dist/electron-template';
    }
  }

  return {
    plugins: createPlugins({ env, isBuild }),
    base: './',
    server: {
      host: '0.0.0.0',
      port: 8898,
      proxy: {
        '^/api': {
          target: 'http://127.0.0.1:8899',
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      outDir,
      emptyOutDir: true
    },
    resolve: {
      alias: {
        '@/router/router': fileURLToPath(new URL('./src/router/router' + (env.VITE_APP_PLATFORM === 'vscode' ? '.vsc' : '.pc'), import.meta.url)),
        '@/stores/setting': fileURLToPath(new URL('./src/stores/setting' + (env.VITE_APP_PLATFORM === 'vscode' ? '.vsc' : '.pc'), import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  };
});
