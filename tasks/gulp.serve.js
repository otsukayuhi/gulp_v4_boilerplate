const conf = require('../conf')
const browserSync = require('browser-sync')
const connectSSI = require('connect-ssi')
const connect = require('gulp-connect-php')

const serve = () => {
  return connect.server({
    base: 'dist',
    port: 8000,
    stdio: 'ignore'
  }, () => {
    browserSync({
      proxy: 'localhost:8000',
      open: false,
      ghostMode: false,
      notify: false,
      files: conf.path.dist,
      middleware: connectSSI({
        baseDir: './dist',
        ext: '.html'
      })
    });
  });
}

exports.serve = serve
