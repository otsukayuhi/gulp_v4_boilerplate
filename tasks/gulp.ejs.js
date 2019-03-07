const conf = require('../conf')
const gulp = require('gulp')
const ejs = require('gulp-ejs')
const data = require('gulp-data')
const fs = require('fs')

const markup = () => {
  const pathJson = `${conf.path.src}ejs/_json/`

  fs.access(`${pathJson}_conf.json`, fs.R_OK | fs.W_OK, err => {
    const json_conf = err ? {} : JSON.parse(fs.readFileSync(`${pathJson}_conf.json`))
    const onError = err => {
      console.log(err.message)
      this.emit('end')
    }

    return gulp.src([
      `${conf.path.src}ejs/**/*.ejs`,
      `!${conf.path.src}ejs/**/_*.ejs`
    ])
      .pipe(data(file => {
        const filename = file.path
        const absolutePath = filename.split('_ejs/')[filename.split('_ejs/').length - 1].replace('.ejs', '.html')
        const relativePath = './'.repeat([absolutePath.split('/').length - 1])

        json_conf.relativePath = relativePath
        return json_conf;
      }))
      .pipe(ejs({
        'conf': json_conf,
        'relativePath': json_conf.relativePath
      }, {}, {
        ext: '.html'
      }).on('error', onError))
      .pipe(gulp.dest(`${conf.path.dist}`))
  })
  return Promise.resolve()
}

exports.markup = markup