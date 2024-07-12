import electron from 'vite-plugin-electron';
import path from 'path';

const r = (...args: string[]) => path.resolve(...args);

export default (isBuild: boolean) => {
  const cwd = process.cwd();

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
        alias: {
          '@any-reader/core': r(cwd, '../../packages/core/src'),
          '@any-reader/shared': r(cwd, '../../packages/shared/src')
        }
      }
    }
  });
};
