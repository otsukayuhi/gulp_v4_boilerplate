const mode = (process.env.NODE_ENV === 'production')? process.env.NODE_ENV : 'development'

module.exports = {
  mode,
  path: {
    src: 'src/',
    dist: 'dist/'
  },
  useTemplateEngine: 'ejs'
};