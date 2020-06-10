const webpackMerge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config.base')
const terserWebpackPlugin = require('terser-webpack-plugin') // 压缩js

const webpackConfig = webpackMerge(baseWebpackConfig, {
  mode: 'production',
  stats: {
    children: false,
    warnings: false
  },
  optimization: {
    minimizer: [
      new terserWebpackPlugin({
        terserOptions: {
          warnings: false,
          compress: {
            warnings: false,
            drop_console: false, // 是否注释掉所有的log
            dead_code: true,
            drop_debugger: true
          },
          // 一行输出的结构
          output: {
            comments: false,
            beautify: false
          },
          mangle: true
        },
        parallel: true,
        sourceMap: false
      })
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 3,
          enforce: true
        }
      }
    }
  }
})

module.exports = webpackConfig
