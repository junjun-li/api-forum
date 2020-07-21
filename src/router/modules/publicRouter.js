import Router from 'koa-router'

import publicController from '@/api/publicController'
import UserController from '@/api/UserController'

const router = new Router()

router.prefix('/public') // prefix在当前router下面加前缀

router.get('/getCaptcha', publicController.getCaptcha)



export default router
