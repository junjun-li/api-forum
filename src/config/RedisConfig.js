import redis from 'redis'
import { promisifyAll } from 'bluebird'
import config from './index'
const options = {
  host: config.REDISCONFIG.host,
  port: config.REDISCONFIG.port,
  password: config.REDISCONFIG.password,
  detect_buffers: true, // 如果设置为true，则答复将作为缓冲区发送到回调。
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error('The server refused the connection')
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error('Retry time exhausted')
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000)
  }
}

// 1. 使用 promisify 让我们可以使用promise的方式调用
// const client = redis.createClient(options)

// const setValue = (key, value) => {
//   if (value === undefined || value === null || value === '') {
//     return
//   }
//   if (typeof value === 'string') {
//     return client.set(key, value)
//   } else if (typeof value === 'object') {
//     // Object.keys 获取到一个对象的所有key, 返回key组成的数组
//     Object.keys(value).forEach((item) => {
//       client.hset(key, item, value[item], redis.print)
//     })
//   }
// }

// const { promisify } = require('util')
// // const getAsync = promisify(client.get).bind(client)

// // getAsync.then(console.log).catch(console.error)
// const getValue = (key) => {
//   return promisify(client.get).bind(client)(key)
//   // return promisify(client.get).bind(client)
// }

// const getHValue = (key) => {
//   return promisify(client.hgetall).bind(client)(key)
// }

// setValue('imooc', 'imooc message redis')

// getValue('imooc').then((res) => {
//   console.log(res)
// })

// setValue('imoocobj', { name: 'junjuntest', age: 22, email: '11776174@qq.com' })

// getHValue('imoocobj').then((res) => {
//   console.log(res)
// })

// export { client, setValue, getValue, getHValue }

// 2. 使用 bluebird

const client = promisifyAll(redis.createClient(options))

client.on('error', (err) => {
  console.log('redis连接失败: ' + err)
})

export const setValue = (key, value, time) => {
  if (value === undefined || value === null || value === '') {
    return
  }
  if (typeof value === 'string') {
    if(time) {
      return client.set(key, value, 'EX', time)
    } else {
      return client.set(key, value)
    }
  } else if (typeof value === 'object') {
    // Object.keys 获取到一个对象的所有key, 返回key组成的数组
    Object.keys(value).forEach((item) => {
      client.hset(key, item, value[item], redis.print)
    })
  }
}

export const getValue = (key) => {
  return client.getAsync(key)
}

export const getHValue = (key) => {
  return client.hgetallAsync(key)
}

export const delValue = (key) => {
  client.del(key, (err, res) => {
    if (res === 1) {
      console.log('成功删除')
    } else {
      console.log('失败: ' + err)
    }
  })
}
