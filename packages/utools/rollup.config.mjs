import esbuild from 'rollup-plugin-esbuild';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';

const entries = [
  {
    path: 'src/index.ts',
    format: ['cjs']
  }
];
const external = [];

const plugins = [
  alias({
    entries: [
      {
        find: /^node:(.+)$/,
        replacement: '$1'
      }
    ]
  }),
  resolve({
    preferBuiltins: true
  }),
  json(),
  commonjs(),
  esbuild({
    minify: true
  })
];

export default [
  ...entries.map(({ path: input, format }) => ({
    input,
    output: [
      {
        dir: './public/libs',
        format: 'cjs'
      }
    ].filter((o) => format.includes(o.format)),
    external,
    plugins
  }))
];
