import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  externals: [
    'axios',
    'base64-js',
    'cheerio',
    'compressing',
    'jsonpath-plus',
    'pako',
    'urlencode',
    'xmldom',
    'xpath.js',
    'puppeteer',
  ],
  clean: true,
  declaration: true,
  rollup: {
    inlineDependencies: true,
    emitCJS: true,
    esbuild: {
      minify: true,
    },
  },
})
