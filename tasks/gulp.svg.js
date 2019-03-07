const conf = require('../conf')
const gulp = require('gulp')
const path = require('path')
const svgstore = require('gulp-svgstore')
const svgmin = require('gulp-svgmin')
const cheerio = require('gulp-cheerio')
const rename = require('gulp-rename')

const svg = () => {
  // Generate SVG sprite
  const destFileName = 'sprite' // 出力されるSVGスプライトのファイル名
  return gulp.src(`${conf.path.src}/svg/**/*.svg`, {
    base: `${conf.path.src}/svg`
  })
    .pipe(rename(file => {
      const name = file.dirname.split(path.sep)
      name[0] = name[0] === '.' ? null : name[0]
      name.push(file.basename)
      if (name[0]) file.basename = name.join('-')
    }))
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(cheerio({
      run($) {
        $('[fill]').removeAttr('fill')
        $('[stroke]').removeAttr('stroke')
        $('svg').attr('style', 'display:none')
        $('symbol').each(() => { // 各symbolのpathに対して固有のIDを持たせることで、パスごとのfillをCSSで調整出来るようにしている。
          const symbol = $(this)
          const path = symbol.find('path')
          const id = symbol.attr('id')
          path.each(index => {
            const _index = parseInt(index, 10) + 1
            const _zero_padding_index = (`00${_index}`).slice(-2)
            $(this).attr('id', `${id}-${_zero_padding_index}`)
          })
        })
      },
      parserOptions: {
        xmlMode: true
      }
    }))
    .pipe(rename({
      basename: destFileName
    }))
    .pipe(gulp.dest(`${conf.path.dist}/svg/`))
}

exports.svg = svg