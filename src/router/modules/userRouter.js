import Router from 'koa-router'

import UserController from '@/api/UserController'

const router = new Router()

router.prefix('/user')

router.get('/fav', UserController.userSign)

router.post('/basic', UserController.updateUserInfo)

router.get('/sendUpdateEmail', UserController.sendUpdateEmail)

router.get('/updateUsername', UserController.updateUsername)

export default router
