import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  clean: true,
  declaration: true,
  rollup: {
    // inlineDependencies: true,
    emitCJS: true,
    esbuild: {
      tsconfigRaw: {
        compilerOptions: {
          // typeorm: https://github.com/unjs/unbuild/issues/309
          experimentalDecorators: true,
        },
      },

      minify: true,
    },
  },
})
