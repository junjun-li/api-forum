import svgCaptcha from 'svg-captcha'
import { setValue } from '../config/RedisConfig'
class PublicController {
  async getCaptcha (ctx) {
    // 获取get请求的参数
    const body = ctx.request.query
    const newCaptca = svgCaptcha.create({
      size: 4, // 验证码长度
      ignoreChars: '0o1il', // 验证码字符中排除 0o1i
      color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
      noise: Math.floor(Math.random() * 5), // 干扰线条的数量
      width: 150,
      height: 38
    })
    // console.log(newCaptca)
    // 设置redis 键 值 过期时间 五分钟过期
    setValue(body.sid, newCaptca.text, 60 * 5)
    ctx.body = {
      code: 0,
      data: newCaptca.data,
      msg: '验证码发送成功'
    }
  }
}

export default new PublicController()
