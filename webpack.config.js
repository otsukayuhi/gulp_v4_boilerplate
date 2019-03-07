const conf = require('./conf')
const glob = require('glob')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

// path
const src = conf.path.src

// jQuery
const globalLibrary = {
  $: 'jquery',
  jQuery: 'jquery'
}

// 共通ファイルを別で書き出すか否か？
// 'initial': 共通ファイルとして、別途書き出し。
// 'async': エントリーポイントにまとめて書き出し
const splitChunks = {
  chunks: 'initial',
  automaticNameDelimiter: '.',
  minSize: 100000,
  cacheGroups: {
    styles: {
      name: 'styles',
      test: /\.css$/,
      enforce: true
    }
  }
}

// entry settings
let entry = {}

// .jsファイルを取得
glob.sync(`./${src}js/entries/**/*.js`, {
  ignore: `./${src}js/modules/**/*.js`
}).map(file => {
  const filePath = new RegExp(`./${src}js/entries/`)
  const key = file.replace(filePath, '').replace(/\.js$/, '')
  entry[key] = file
})

module.exports = (mode, drop_console, sourceMap) => {
  return {
    entry,
    mode,
    devtool: 'inline-source-map',
    stats: {
      children: false
    },

    module: {
      rules: [{
        test: /\.(css|scss)$/,
        use: [{
          loader: MiniCssExtractPlugin.loader
        },
        {
          loader: 'css-loader',
          options: {
            url: true,
            importLoaders: 2,
            sourceMap
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap,
            plugins: [
              autoprefixer({
                grid: true
              })
            ]
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap
          }
        }
        ]
      },
      {
        test: /\.(gif|png|jpg|eot|wof|woff|ttf|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: '[path]/[name].[ext]',
            outputPath: 'lib-bgi/',
            publicPath: '/img/lib-bgi/'
          }
        }]
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        // 拡張子 .js の場合
        test: /\.js$/,
        use: [{
          // Babel を利用する
          loader: 'babel-loader',
          // Babel のオプションを指定する
          options: {
            presets: [
              // プリセットを指定することで、ES2018 を ES5 に変換
              '@babel/preset-env'
            ]
          }
        }]
      }
      ]
    },
    output: {
      filename: 'js/[name].js'
    },
    resolve: {
      extensions: ['.js', '.js'],
      alias: {
        '@': `${__dirname}${src}js/`
      }
    },
    optimization: {
      splitChunks,
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              // 本番用ビルド時、コンソールログを非表示
              drop_console,
            }
          }
        }),
        new OptimizeCSSAssetsPlugin()
      ]
    },
    plugins: [
      new webpack.ProvidePlugin(globalLibrary),
      new MiniCssExtractPlugin({
        filename: `${src}css/[name].css`
      }),
    ]
  }
}