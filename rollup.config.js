import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'


export default {
  input: 'index.js',
  output: {
    file: './dist/bundle.js',
    format: 'esm'
  },
  plugins:[
    babel({
      exclude: 'node_modules/**',
    }),
    livereload(),
    serve({
      open: true, // 自动打开页面
      port: 8887,
      openPage: '/public/index.html', // 打开的页面
      contentBase: ''
    })
  ]
}