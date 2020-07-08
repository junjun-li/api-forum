// 用于给WebStorm作为指引
const resolve = dir => require('path').join(__dirname, dir)

module.exports = {
  resolve: {
    alias: {
      '@': resolve('src')
    }
  }
}
