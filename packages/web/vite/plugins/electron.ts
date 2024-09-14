import electron from 'vite-plugin-electron';
import { alias } from '../../../../alias';

export default (isBuild: boolean) => {
  return electron({
    entry: 'electron/main.ts',
    vite: {
      build: {
        sourcemap: isBuild ? false : true,
        outDir: 'dist/electron-js',
        rollupOptions: {
          external: ['sqlite3', 'typeorm']
        }
      },
      resolve: {
        alias
      }
    }
  });
};
