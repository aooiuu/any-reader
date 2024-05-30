import esbuild from 'rollup-plugin-esbuild'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import alias from '@rollup/plugin-alias'

const entries = [
  {
    path: 'src/index.ts',
    name: 'any-reader',
    format: ['cjs'],
  },
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

export default [
  ...entries.map(({ path: input }) => ({
    input,
    output: [
      {
        banner: '#!/usr/bin/env node',
        dir: './dist',
        format: 'cjs',
      },
    ],
    external: [
    ],
    plugins,
  })),
]
