import electron from 'vite-plugin-electron';

export default () =>
  electron({
    entry: 'electron/main.ts',
    vite: {
      build: {
        outDir: 'dist/electron-js',
        rollupOptions: {
          external: []
        }
      }
    }
  });
