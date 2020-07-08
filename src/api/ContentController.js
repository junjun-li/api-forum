import Post from '@/model/Post'
import Links from '@/model/Links'

// db.getCollection('posts').updateMany({}, {$set: { "uid": "5eed6f5b81fcb4331850a7e3" }})
// 参数1 更新整个表格

class ContentController {
  async getPostList (ctx) {
    const body = ctx.query
    // 先来个测试数据
    // const postTest = new Post({
    //   title: '7.8测试- discuss 交流呀呀呀🧐',
    //   content: 'discuss-交流',
    //   catalog: 'advise',
    //   fav: 10,
    //   isEnd: '1',
    //   reads: '105',
    //   answer: '136',
    //   status: '0',
    //   isTop: '1',
    //   // sort: '0',
    //   tags: [
    //     {
    //       name: '后端',
    //       class: ''
    //     }
    //   ]
    // })
    // const tmp = await postTest.save()
    // console.log('ContentController -> getPostList -> tmp', tmp)

    // const sort = body.sort ? body.sort : 'created' // 按照创建时间
    const sort = body.sort ? body.sort : 'answer' // 按照热议
    // parseInt字符串转数字
    const page = body.page ? parseInt(body.page) : 0
    const limit = body.limit ? parseInt(body.limit) : 20
    const options = {}
    // debugger
    if (typeof body.catalog !== 'undefined' && body.catalog !== '') {
      options.catalog = body.catalog
    }
    // 是否置顶
    if (typeof body.isTop !== 'undefined') {
      options.isTop = body.isTop
    }
    // 文章的状态， ‘’-全部 ，0-未关闭，1-已结贴
    if (typeof body.status !== 'undefined' && body.status !== '') {
      options.status = body.status
    }
    // 是否结贴 0-未结束,1-已结贴
    if (typeof body.isEnd !== 'undefined') {
      options.isEnd = body.isEnd
    }
    if (typeof body.tag !== 'undefined' && body.tag !== '') {
      // mongoDB 嵌套查询
      options.tags = {
        $elemMatch: { name: body.tag }
      }
    }
    // debugger
    const result = await Post.getList(options, sort, page, limit)
    ctx.body = {
      code: 0,
      data: result,
      msg: '查询成功'
    }
  }

  // 友情链接
  async getLinks (ctx) {
    // title: { type: String },
    // link: { type: String, default: 'link' },
    // created: { type: Number },
    // isTop: { type: String },
    // sort: { type: String },
    // type: '
    // const linkTest = new Links({
    //   title: '慕课网',
    //   link: 'www.imooc.com',
    //   type: 'link',
    //   isTop: '1',
    //   sort: '0'
    // })
    // const tmp = await linkTest.save()
    let result = await Links.find({ type: 'link' })
    ctx.body = {
      code: 0,
      data: result,
      msg: '获取成功'
    }
  }

  // 温馨通道
  async getTips (ctx) {
    // const linkTest = new Links({
    //   title: 'note',
    //   link: 'http://121.37.183.14:16589/chapter1/',
    //   type: 'tip',
    //   isTop: '0',
    //   sort: '0'
    // })
    // const tmp = await linkTest.save()
    let result = await Links.find({ type: 'tip' })
    ctx.body = {
      code: 0,
      data: result,
      msg: '获取成功'
    }
  }

  // 本周热议
  async getTopWeek (ctx) {
    let result = await Post.getTopWeek()
    ctx.body = {
      code: 0,
      data: result,
      msg: '获取成功'
    }
  }
}

export default new ContentController()
