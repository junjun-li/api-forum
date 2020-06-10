import Koa from 'koa'
import helmet from 'koa-helmet'
import statics from 'koa-static'
import path from 'path'
import koaBody from 'koa-body' // 处理post请求
import jsonutil from 'koa-json' // 输出的json格式,让他漂亮一点
import cors from '@koa/cors'
import compose from 'koa-compose' // 整合中间件
import compress from 'koa-compress'
import router from './router/routes'
const app = new Koa()

const middleware = compose([
  koaBody(),
  statics(path.join(__dirname, '../public')),
  cors(),
  jsonutil({ pretty: false, param: 'pretty' }),
  helmet()
])
// 是否是开发环境
const isDevMode = process.env.NODE_ENV === 'production' ? false : true

if (!isDevMode) {
  app.use(compress())
}

app.use(middleware)

app.use(router())

let port = !isDevMode ? 12005 : 3000

app.listen(port, () => {
  console.log(`The serve running at:${port}`)
})
