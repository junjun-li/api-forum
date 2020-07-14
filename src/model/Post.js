import mongoose from '@/config/DBHelpler'
import moment from 'dayjs'

const Schema = mongoose.Schema

const PostSchema = new Schema({
  // tid: { type: String }, // 默认的 id
  // uid: { type: String }, // 用户 id
  uid: {
    type: String,
    ref: 'users'
  }, // 找到 users 表
  title: { type: String }, // 文章标题
  content: { type: String }, // 文章内容
  created: { type: Date }, // 创建时间
  catalog: { type: String }, // 帖子分类, index-全部,ask-提问,advise-建议,discuss-交流,share-分享,news-动态
  fav: { type: String }, // 帖子积分
  isEnd: { type: String }, // 0-未结束,1-已结贴
  reads: { type: Number }, // 阅读计数
  answer: { type: Number }, // 回答计数
  status: { type: String }, // 0-打开回复,1-关闭回复
  isTop: { type: String }, // 0-未置顶,1-已置顶
  sort: { type: String }, // 置顶排序
  tags: { type: Array } // 文章的标签,精华,加精,etc
})

// 添加中间件 创建时间
PostSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

// 添加静态方法
PostSchema.statics = {
  /**
   * 获取文章列表数据
   * @param {Object} options 筛选条件
   * @param {String} sort 排序方式
   * @param {Number} page 分页页数
   * @param {Number} limit 分页条数
   */
  getList: function (options, sort, page, limit) {
    // sort({ created: -1 }) 排序 倒叙
    // .skip(page * limit) 跳过多少页
    // .limit(limit) 取多少条数据
    // populate 用于联合查询
    // debugger
    return (
      this.find(options)
        .sort({ [sort]: -1 })
        // .skip(page * limit)
        // .limit(limit)
        .populate({
          path: 'uid', // 根据 posts中的uid字段, 找到 users中的数据 把以下数据捞出来
          select: 'name isVip pic roles' // 筛选出来的字段
        })
    )
  },
  // 查询本周热议 7天以内 评论数最多的
  getTopWeek: function () {
    return this.find({
      created: {
        // $get操作运算符
        $gte: moment().subtract(7, 'day')
      }
    },
    // 那些数据需要给到我
    {
      answer: 1, // 筛选需要的字段 0不需要 1需要
      title: 1
    })
      .sort({
        answer: -1 // 倒叙排序
      })
      .limit(15)
  }
  // getTopWeek: function () {
  //   return this.find(
  //     {
  //       created: {
  //         $gte: moment().subtract(7, 'days')
  //       }
  //     },
  //     {
  //       answer: 1,
  //       title: 1
  //     }).sort({ answer: -1 })
  //     .limit(15)
  // }
}

const PostModel = mongoose.model(
  'post',
  PostSchema,
  'post'
)

export default PostModel
