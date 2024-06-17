const esbuild = require('rollup-plugin-esbuild').default
const resolve = require('@rollup/plugin-node-resolve').default
const commonjs = require('@rollup/plugin-commonjs').default
const json = require('@rollup/plugin-json').default
const alias = require('@rollup/plugin-alias').default

const entries = [
  {
    path: 'src/index.ts',
    format: ['cjs'],
  },
]
const external = [
]

const plugins = [
  alias({
    entries: [
      {
        find: /^node:(.+)$/,
        replacement: '$1',
      },
    ],
  }),
  resolve({
    preferBuiltins: true,
  }),
  json(),
  commonjs(),
  esbuild({
    minify: true,
  }),
]

module.exports = [
  ...entries.map(({ path: input, format }) => ({
    input,
    output: [
      {
        dir: './public/libs',
        format: 'cjs',
      },
    ].filter(o => format.includes(o.format)),
    external,
    plugins,
  })),
]
