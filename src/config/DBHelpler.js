import mongoose from 'mongoose'
import config from './index'

mongoose.set('useCreateIndex', true)

// 创建连接
mongoose.connect(config.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// 连接成功
mongoose.connection.on('connected', () => {
  console.log('连接成功, 地址为: ' + config.DB_URL)
})

// 连接异常
mongoose.connection.on('error', (err) => {
  console.log('连接失败: ' + err)
})

// 断开连接
mongoose.connection.on('disconnected', () => {
  console.log('断开连接')
})

export default mongoose
