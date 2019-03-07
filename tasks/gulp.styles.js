const conf = require('../conf')
const gulp = require('gulp')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer')
const rucksack = require('rucksack-css')

const styles = () => {
  /**
   * プラグイン一覧
   *
   * - autoprefixer: ベンダープレフィックスの付与
   * - rucksack: いい感じのやつ
   *
   */
  const plugins = [
    autoprefixer({
      grid: true
    }),
    rucksack()
  ]

  return gulp.src(`${conf.path.src}scss/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(gulp.dest(`${conf.path.dist}`))
}

exports.styles = styles