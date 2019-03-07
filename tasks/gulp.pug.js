const conf = require('../conf')
const gulp = require('gulp')
const pug = require('gulp-pug')
const data = require('gulp-data')
const plumber = require('gulp-plumber')
const path = require('path')

const markup = () => {
  const locals = {}
  locals.mode = conf.mode

  return gulp.src([
    `${conf.path.src}pug/**/*.pug`,
    `!${conf.path.src}/pug/**/_*.pug`
  ])
    .pipe(plumber())
    .pipe(data(file => {
      locals.relativePath = path.relative(file.base, file.path.replace(/.pug$/, '.html')).replace(/index.html$/, '')
      return locals
    }))
    .pipe(pug({
      locals,
      basedir: `${conf.path.src}/pug/`
    }))
    .pipe(gulp.dest(`${conf.path.dist}`))
}

exports.markup = markup