import mongoose from '@/config/DBHelpler'

const Schema = mongoose.Schema

const SignRecordSchema = new Schema({
  uid: {
    type: String,
    ref: 'users'
  },
  created: { type: Number },
  fav: { type: String },
  lastSign: { type: String }
})

SignRecordSchema.pre('save', function (next) {
  this.created = new Date().getTime()
  next()
})

const SignRecordModel = mongoose.model(
  'sign_record',
  SignRecordSchema,
  'sign_record'
)

export default SignRecordModel
