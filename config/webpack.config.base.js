const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')
const utils = require('./utils')
const webpackconfig = {
  target: 'node',
  entry: {
    server: path.join(utils.APP_PATH, 'index.js')
  },
  output: {
    // path: path.join(__dirname, './dist'),
    path: utils.DIST_PATH,
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader'
        },
        exclude: [path.join(__dirname, '/node_modules')]
      }
    ]
  },
  externals: [nodeExternals()],
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env':
        process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod'
          ? "'production'"
          : "'development'"
    })
  ],
  node: {
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filename: true,
    __dirname: true,
    setImmediate: true,
    path: true
  }
}

module.exports = webpackconfig

// "@babel/core": "^7.10.0",
// "@babel/node": "^7.8.7",
// "@babel/preset-env": "^7.10.0", // 对新特性做支持
// "babel-loader": "^8.1.0",
// "clean-webpack-plugin": "^3.0.0", // 清理dist目录的文件
// "cross-env": "^7.0.2", // 设置环境变量
// "webpack": "^4.43.0",
// "webpack-cli": "^3.3.11",
// "webpack-node-externals": "^1.7.2" // 对node_module下面的文件做一个排除的处理

// webpack的调试
// npx node --inspect-brk ./node_modules/.bin/webpack --inline --progress
