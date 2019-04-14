import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.js',
  output: {
    name: 'romanize',
    file: 'romanize.umd.js',
    format: 'umd'
  },
  plugins: [ 
    resolve({
      main: true
    }),
    commonjs({
      include: ['node_modules/**']
    }),
    babel({
      exclude: ['node_modules/**']
    })
  ]
};
