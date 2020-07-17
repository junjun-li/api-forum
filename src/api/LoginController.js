import send from '../config/MailConfig'
import moment from 'dayjs'
import jsonwebtoken from 'jsonwebtoken'
import config from '@/config'
import { checkCode } from '@/common/utils'
import User from '@/model/User'
import bcrypt from 'bcrypt'
import SignRecord from '@/model/SignRecord'
class LoginController {
  async forget (ctx) {
    const { body } = ctx.request // 通过 ctx.request 获取post带过来的参数
    try {
      const result = await send({
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

  async reg (ctx) {
    // 1. 判断验证码是否有效
    // 2. 判断库里面是否存在该邮箱
    // 3. 判断库里面是否存在改昵称
    const { body } = ctx.request
    // let body = {
    //   username: '11776174@qq.com',
    //   name: 'lijunjun',
    //   password: '123456',
    //   repassword: '123456',
    //   code: '1234'
    // }
    const result = await checkCode(body.sid, body.code)
    let check = true
    if (result) {
      // 验证码有效 查询库里面是否存在该邮箱
      const user = await User.findOne({ username: body.username })
      if (user !== null && typeof user.username !== 'undefined') {
        check = false
        ctx.body = {
          code: 1,
          msg: '该邮箱已存在,您可以直接登录或重新设置密码'
        }
      }
      const name = await User.findOne({ name: body.name })
      if (name !== null && typeof name.name !== 'undefined') {
        check = false
        ctx.body = {
          code: 1,
          msg: '该昵称已存在'
        }
      }
      if (check) {
        // 写入数据库
        // 密码加密
        body.password = await bcrypt.hash(body.password, 5)
        const user = new User({
          username: body.username,
          name: body.name,
          password: body.password,
          created: new Date().getTime()
        })
        const result = await user.save()
        ctx.body = {
          code: 0,
          data: result,
          msg: '注册成功'
        }
      }
    } else {
      ctx.body = {
        code: 1,
        msg: '验证码错误或已过期,请刷新验证码'
      }
    }
  }

  async login (ctx) {
    // 1. 接收用户数据
    // 2. 验证图片验证码的正确和实效性
    // 3. 验证用户名密码正确
    // 4. 返回token
    let {
      body: { username, password, code, sid }
    } = ctx.request // 用于接收post的参数
    // 根据sid 判断code是否过期及有效
    const result = await checkCode(sid, code)
    if (result) {
      // 查库 匹配数据库的用户名和密码
      let checkUserPassword = false
      const user = await User.findOne({
        username
      })
      // 比较库里面的和传过来的密码是否正确
      if (await bcrypt.compare(password, user.password)) {
        checkUserPassword = true
      }
      if (checkUserPassword) {
        const token = jsonwebtoken.sign(
          {
            _id: user._id,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 // 方式1设置过期时间 1小时过期
            // exp: Math.floor(Date.now() / 1000) + 60 * 1 // 方式1设置过期时间 1小时过期
          },
          config.JWT_SECREY
        )
        // 把json数据捞出来
        let userObj = user.toJSON()
        // 删除掉一些铭感的数据
        let arr = ['password', 'username', 'roles']
        arr.forEach(item => {
          delete userObj[item]
        })
        // 加入一个今日是否签到的属性
        let signRecord = await SignRecord.findByUid(userObj._id)
        if (signRecord !== null) {
          // debugger
          // 说明以前签到过了, 再看看签到
          if (moment(signRecord.created).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
            userObj.isSign = true
          } else {
            userObj.isSign = false
          }
          userObj.lastSign = signRecord.created
        } else {
          userObj.isSign = false
        }
        ctx.body = {
          code: 200,
          data: {
            ...userObj,
            token
          },
          msg: '登录成功'
        }
      } else {
        ctx.body = {
          code: 1,
          msg: '用户名或密码错误'
        }
      }
    } else {
      ctx.body = {
        code: 1,
        msg: '验证码错误或已过期'
      }
    }
  }
}

export default new LoginController()
