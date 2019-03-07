const conf = require('../conf')
const gulp = require('gulp')
const imagemin = require('gulp-imagemin')

const imageminTask = () => {
  return gulp.src(`${conf.path.dist}/**/*.{jpg,jpeg,png,gif}`)
    .pipe(imagemin())
    .pipe(gulp.dest(`${conf.path.dist}`))
}

exports.imagemin = imageminTask