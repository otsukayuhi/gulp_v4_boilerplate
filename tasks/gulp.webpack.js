const conf = require('../conf')
const gulp = require('gulp')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const webpackConfig = require('../webpack.config')

const webpackTask = () => {
  const hideConsoleLog = (conf.mode === 'production') ? true : false
  const sourceMap = (conf.mode === 'development') ? true : false

  return webpackStream(webpackConfig(conf.mode, hideConsoleLog, sourceMap), webpack)
    .pipe(gulp.dest(`${conf.path.dist}`))
}

exports.webpack = webpackTask