import mongoose from '@/config/DBHelpler'
import moment from 'dayjs'
const Schema = mongoose.Schema

const LinksSchema = new Schema({
  title: { type: String },
  link: { type: String },
  created: { type: Date },
  isTop: { type: String },
  sort: { type: String },
  type: {
    type: String,
    default: 'link'
  }
})

LinksSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

// Schema.set('collection', 'actor')

const LinksModel = mongoose.model(
  'link',
  LinksSchema,
  // 神坑 解决自动添加s的问题
  // 详细见官网 https://mongoosejs.com/docs/api.html#connection_Connection-model
  // When no collection argument is passed, Mongoose produces a collection name by passing the model name to the utils.toCollectionName method. This method pluralizes the name. If you don't like this behavior, either pass a collection name or set your schemas collection name option.
  'link'
)

export default LinksModel
