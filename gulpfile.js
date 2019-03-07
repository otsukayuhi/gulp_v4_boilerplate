const conf = require('./conf')
const { watch, parallel } = require('gulp')
const { markup } = require(`./tasks/gulp.${conf.useTemplateEngine}`)
const { styles } = require('./tasks/gulp.styles')
const { webpack } = require('./tasks/gulp.webpack')
const { svg } = require('./tasks/gulp.svg')
const { imagemin } = require('./tasks/gulp.imagemin')
const { serve } = require('./tasks/gulp.serve')

exports.markup = markup
exports.styles = styles
exports.webpack = webpack
exports.svg = svg
exports.imagemin = imagemin
exports.serve = serve

const fileWatch = () => {
  watch(`src/${conf.useTemplateEngine}/**/*.${conf.useTemplateEngine}`, markup)
  watch('src/scss/**/*.scss', styles)
  watch('src/js/**/*.js', webpack)
}

exports.dev = parallel(markup, styles, webpack, fileWatch, serve)
exports.watch = parallel(markup, styles, webpack, fileWatch)
exports.build = parallel(markup, styles, webpack)