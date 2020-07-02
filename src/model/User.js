import mongoose from '../config/DBHelpler'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  // username: { type: String },
  // password: { type: String },
  // name: { type: String },
  // created: { type: Number }
  // uid: { type: String },// 默认产生的 ObjectId, 取的时候需要\_id
  username: {
    type: String,
    // 加入索引来达到去重的目的
    index: { unique: true }, // 创建一个唯一的索引 使用index添加索引
    sparse: true // 必须要有这个索引才进行检索
  }, // 用户名
  password: { type: String }, // 密码
  name: { type: String }, // 昵称
  created: { type: Number }, // 注册时间
  updated: { type: Number }, // 更新时间
  favs: { type: Number, default: 100 }, // 用户积分
  gender: { type: String, default: '0' }, // 性别, 0-男 1-女
  roles: { type: Array, default: ['user'] }, // 角色 user-普通用户, admin-管理员, super_admin-超级管理员
  pic: { type: String, default: '/img/1587000589108.png' }, // 用户头像
  mobile: { type: Number, match: /^1[3-9](\d{9})$/, default: '' }, // 手机号码
  status: { type: String, default: '0' }, // 是否被禁用 0-正常 1-禁言 2-账号禁用
  regmark: { type: String, default: '' }, // 个性签名
  location: { type: String, default: '' }, // 城市
  isVip: { type: String, default: '0' }, // 是否是vip用户 0-普通用户 1-会员用户 2-7 vip的等级
  count: { type: Number, default: 0 } // 签到次数
})
// 保存的时候 传一个时间
UserSchema.pre('save', function (next) {
  // this.created = moment().format('YYY-MM-DD HH:mm:ss')
  this.created = new Date().getTime()
})

// 更新时间
// UserSchema.pre('update', function (next) {
//   this.updated = moment().format('YYY-MM-DD HH:mm:ss')
// })

// 从数据库的层面上杜绝了数据的重复插入
UserSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Error: 数据库重复插入')) // 重复存储同一个邮箱
  } else {
    next(error)
  }
})

// 添加静态方法
UserSchema.statics = {
  // 根据id来查询
  findById: function (id) {
    return this.findOne(
      { _id: id },
      // 查询的结果不包含以下字段
      {
        password: 0,
        username: 0,
        mobile: 0
      }
    )
  }
}

const UserModel = mongoose.model('users', UserSchema)

export default UserModel
