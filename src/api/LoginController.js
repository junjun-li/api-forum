import send from '../config/MailConfig'
import moment from 'moment'

class LoginController {
  constructor() {}
  async forget(ctx) {
    const { body } = ctx.request // 通过 ctx.request 获取post带过来的参数
    try {
      let result = await send({
        code: '1234',
        expire: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'), // 过期时间
        email: body.username,
        user: 'junjun'
      })
      ctx.body = {
        code: 200,
        data: result,
        message: '邮件发送成功'
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export default new LoginController()
