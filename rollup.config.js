/**
 * @file rollup config
 * @author junbinluo
 * @date 2018/4/28
 */

import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import istanbul from 'rollup-plugin-istanbul';
import uglify from 'rollup-plugin-uglify';

let plugins = [
  babel(babelrc()),
  uglify()
];

if (process.env.BUILD !== 'production') {
  plugins.push(istanbul({
    exclude: ['test/**/*', 'node_modules/**/*']
  }));
}

export default {
  plugins,
  external: ['react'],
  input: 'src/index.js',
  output: {
    globals: {
      react: 'React'
    },
    file: 'dist/grax.min.js',
    name: 'grax-react',
    format: 'umd',
  }
};
