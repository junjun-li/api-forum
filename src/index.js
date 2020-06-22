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
import jwt from 'koa-jwt'
import config from '@/config/index'
import errorHandle from '@/common/errorHandle'

const app = new Koa()

// jwt的使用方式1 顺序不能错
// app.use((ctx, next) => errorHandle(ctx, next))
// app.use(jwt({ secret: config.JWT_SECREY }).unless({ path: [/^\/public/] }))

// jwt的使用方式2 这个包只拥有jwt鉴权的功能,但是生成token还需要另外一个库 jsonwebtoken
const unless_path = [
  '/getCaptcha',
  '/reg'
]
// const JWT = jwt({ secret: config.JWT_SECREY }).unless({ path: [/^\/public/,/^\/login/] })
const JWT = jwt({ secret: config.JWT_SECREY }).unless({ path: unless_path })

const middleware = compose([
  koaBody(),
  statics(path.join(__dirname, '../public')),
  cors(),
  jsonutil({ pretty: false, param: 'pretty' }),
  helmet(),
  // jwt的使用方式2 顺序不能错
  errorHandle,
  JWT
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
