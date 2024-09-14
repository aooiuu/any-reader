import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['src/index', 'src/browser/index'],
  clean: true,
  declaration: true,
  rollup: {
    inlineDependencies: true,
    emitCJS: true,
    esbuild: {
      minify: true
    }
  }
});
