import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';
import { alias } from '../alias';

export default defineConfig({
  optimizeDeps: {
    exclude: ['vitepress']
  },

  plugins: [UnoCSS()],

  server: {
    port: 8897,
    hmr: {
      overlay: false
    }
  },

  resolve: {
    alias
  }
});
