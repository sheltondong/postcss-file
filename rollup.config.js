import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import clear from 'rollup-plugin-clear';

const config = {
  input: './src/index.ts',
  output: {
    file: './dist/index.js',
    format: 'cjs',
  },
  plugins: [
    clear({
      targets: ['./dist'],
    }),
    commonjs(),
    resolve(),
    typescript(),
  ],
  external: Object.keys(require('./package.json').dependencies),
};

export default config;
