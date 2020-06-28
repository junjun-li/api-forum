import mongoose from '../config/DBHelpler'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: { type: String },
  password: { type: String },
  name: { type: String },
  created: { type: Number }
})

const UserModel = mongoose.model('users', UserSchema)
// const run1 = async () => {
//   const result = await UserModel.find()
//   console.log(result)
// }
// run1()

export default UserModel
