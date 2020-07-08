import Router from 'koa-router'

import ContentController from '@/api/ContentController'

const router = new Router()

// 获取文章列表
router.get('/getPostList', ContentController.getPostList)

// 获取友情链接
router.get('/getLinks', ContentController.getLinks)

// 获取温馨提醒
router.get('/getTips', ContentController.getTips)

// 获取本周热议
router.get('/getTopWeek', ContentController.getTopWeek)

export default router
