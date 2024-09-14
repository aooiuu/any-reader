import { defineConfig } from 'vite';
import { alias } from '../alias';

export default defineConfig({
  optimizeDeps: {
    exclude: ['vitepress']
  },
  server: {
    hmr: {
      overlay: false
    }
  },

  resolve: {
    alias
  }
});
