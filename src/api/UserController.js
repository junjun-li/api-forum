import SignRecord from '@/model/SignRecord'
import User from '@/model/User'
import jwt from 'jsonwebtoken'
import config from '@/config/index'
// import { getJWTPayload } from '@/common/utils'
import moment from 'dayjs'

class UserController {
  // 用户签到
  async userSign (ctx) {
    // 1.更具token取出对应的id
    // 2.查询用户上一次签到记录
    // 判断是否是连续签到
    const token = ctx.header.authorization
    // jwt.verify('Bearer token')
    // 把token解析出来,获得用户id和token的创建时间和失效时间
    // debugger
    const obj = await jwt.verify(token.split(' ')[1], config.JWT_SECREY)
    const record = await SignRecord.findByUid(obj._id)
    const userInfo = await User.findById(obj._id)
    let newRecord = {}
    let result = ''
    debugger
    if (record !== null) {
      // 说明有历史的签到数据
      // 判断用户上一次签到的日期和今天的日期是否相同
      // 如果相同,直接返回今天已经签到,
      // 否则 保存签到, 存数据
      console.log(moment(record.created).format('YYYY-MM-DD HH:mm:ss'))
      console.log(moment().format('YYYY-MM-DD'))
      if (moment(record.created).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
        ctx.body = {
          code: 1,
          data: {
            favs: userInfo.favs, // 用户积分
            count: userInfo.count, // 用户签到的次数
            lastSign: record.created // 最后一次签到的时间
          },
          msg: '用户已签到'
        }
        return
      } else {
        // 修改用户表的积分, 连续签到次数(favs,count) 保存积分表的数据
        // 还需要判断是否是连续签到,如果断签,给的积分是不一样的
        let count = userInfo.count
        let fav = 0
        if (moment(record.created).format('YYYY-MM-DD') === moment().subtract(1, 'days').format('YYYY-MM-DD')) {
          // 连续签到
          count += 1
          // 判断连续签到的天数, 给予相对应的积分
          if (count < 5) {
            fav = 5
          } else if (count >= 5 && count < 15) {
            fav = 10
          } else if (count >= 15 && count < 30) {
            fav = 15
          } else if (count >= 30 && count < 100) {
            fav = 20
          } else if (count >= 100 && count < 365) {
            fav = 30
          } else if (count >= 365) {
            fav = 50
          }
          // 更新用户表的积分
          await User.updateOne(
            { _id: obj._id },
            {
              // $inc 在查询的数据递增
              $inc: {
                favs: fav,
                count: 1
              }
            }
          )
          // 返回新的用户积分和累计签到数
          result = {
            favs: userInfo.favs + fav, // 用户原本的积分 + 5积分
            count: userInfo.count + 1 // 累计签到记数
          }
        } else {
          // 断签了 更新用户表
          fav = 5
          await User.updateOne(
            { _id: obj._id }, // 根据id查询用户数据
            {
              $set: { count: 1 }, // 设置连续签到的天数, 1天
              $inc: { favs: fav } // $inc 递增积分
            }
          )
          result = {
            favs: userInfo.favs + fav, // 用户原本的积分 + 5积分
            count: 1 // 累计签到记数
          }
        }
        // 更新积分表
        newRecord = new SignRecord({
          uid: obj._id,
          favs: fav
        })
        await newRecord.save()
      }
    } else {
      // 无签到数据, 说明用户是第一次签到, 要更新用户表的签到记录和签到时间
      // 这里需要保存 用户表里面的签到数据, 也要修改积分表里面的签到记数和积分数据
      await User.updateOne({
        _id: obj._id // 根据用户id来查询数据
      }, {
        $set: { count: 1 }, // $set 设置值, count的值设置成为1
        $inc: { favs: 5 } // $inc 把积分增加5分
      })
      // 保存用户的签到记录, 用户下一次签到的时候,才能判断是否连续的签到
      newRecord = new SignRecord({
        uid: obj._id,
        favs: 5,
        lastSign: moment().format('YYYY-MM-DD HH:mm:ss')
      })
      // 保存这条数据
      await newRecord.save()
      result = {
        favs: 5, // 获取了5积分
        count: 1// 累计签到记数
      }
    }
    ctx.body = {
      code: 0,
      data: result,
      msg: '签到成功'
    }
  }
}

export default new UserController()
