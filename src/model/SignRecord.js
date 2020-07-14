import mongoose from '@/config/DBHelpler'
import moment from 'dayjs'
const Schema = mongoose.Schema

const SignRecordSchema = new Schema({
  uid: {
    type: String,
    ref: 'users'
  },
  created: { type: Date },
  favs: { type: String },
  lastSign: { type: String }
})

SignRecordSchema.pre('save', function (next) {
  this.created = moment().format()
  next()
})

SignRecordSchema.statics = {
  findByUid: function (uid) {
    return this
      .findOne({ uid: uid }) // 根据uid来查找
      .sort({ created: -1 }) // 根据created来倒叙排列
  }
}

const SignRecordModel = mongoose.model(
  'sign_record',
  SignRecordSchema,
  'sign_record'
)

export default SignRecordModel
