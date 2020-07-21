import Router from 'koa-router'

import loginController from '@/api/LoginController'

const router = new Router()
// prefix在当前router下面加前缀
router.prefix('/public')

router.post('/forget', loginController.forget)
router.post('/login', loginController.login)
router.post('/reg', loginController.reg)

export default router
