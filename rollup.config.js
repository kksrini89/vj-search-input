import resolve from '@rollup/plugin-commonjs';
import commonjs from '@rollup/plugin-node-resolve';
import pkg from './package.json';

export default [
  {
    input: 'index.js',
    output: {
      name: 'vjSearchInput',
      file: pkg.browser,
      format: 'umd',
    },
    plugins: [resolve(), commonjs()],
  },
  {
    input: 'index.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
  },
];
