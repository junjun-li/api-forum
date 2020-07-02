import Post from '@/model/Post'

// db.getCollection('post').updateMany({}, {$set: { "uid": "5eed6f5b81fcb4331850a7e3" }})
// 参数1 更新整个表格

class ContentController {
  async getPostList (ctx) {
    const body = ctx.query
    // 先来个测试数据
    // const postTest = new Post({
    //   title: '测试文章 1212',
    //   content: '测试文章的内容 ~~~巴拉巴拉`````~~~~share',
    //   catalog: 'advise',
    //   fav: 20,
    //   isEnd: '1',
    //   reads: '20',
    //   answer: '0',
    //   status: '0',
    //   isTop: '0',
    //   sort: '0',
    //   tags: []
    // })
    // const tmp = await postTest.save()
    // console.log('ContentController -> getPostList -> tmp', tmp)

    // const sort = body.sort ? body.sort : 'created'
    const sort = body.sort ? body.sort : 'answer'
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
    console.log(result)
    ctx.body = {
      code: 0,
      data: result,
      msg: '查询成功'
    }
  }
}

export default new ContentController()
