import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import createPlugins from './vite/plugins';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: createPlugins(),
  base: './',
  server: {
    port: 8899
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
