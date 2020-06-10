import svgCaptcha from "svg-captcha"

class PublicController {
  constructor() {}
  async getCaptcha(ctx) {
    const newCaptca = svgCaptcha.create({
      size: 4, // 验证码长度
      ignoreChars: "0o1il", // 验证码字符中排除 0o1i
      color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
      noise: Math.floor(Math.random() * 5), // 干扰线条的数量
      width: 150,
      height: 50
    })
    ctx.body = {
      code: 200,
      data: newCaptca.data
    }
  }
}

export default new PublicController()
