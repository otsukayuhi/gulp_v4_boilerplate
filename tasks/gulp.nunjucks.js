const conf = require('../conf')
const gulp = require('gulp')
const nunjucksRender = require('gulp-nunjucks-render')
const data = require('gulp-data')
const fs = require('fs')

const markup = () => {
  gulp.task('nunjucks', () => {
    const meta = JSON.parse(fs.readFileSync(`${conf.path.src}/nunjucks/_data/_meta.json`))
    const config = JSON.parse(fs.readFileSync(`${conf.path.src}/nunjucks/_data/_config.json`))
    const sitedata = {
      ...config,
      ...meta
    }
    const getDataForFile = file => {
      sitedata.path.relative = file.relative.replace(/\.njk/, '\.html').replace(/index\.html/, '')
      sitedata.path.absolute = sitedata.path.domain + sitedata.path.relative
      return sitedata
    }

    return gulp.src([
      `${conf.path.src}/nunjucks/**/*.njk`,
      `!${conf.path.src}/nunjucks/**/_*.njk`
    ])
      .pipe(data(getDataForFile))
      .pipe(nunjucksRender({
        path: [`${conf.path.src}/nunjucks/`],
        data: sitedata,
        envOptions: {
          autoescape: false
        }
      }))
      .pipe(gulp.dest(conf.path.dist))
  })
}

exports.markup = markup