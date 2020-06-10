import combineRouters from 'koa-combine-routers'

import publicRouter from './publicRouter'
import loginRouter from './loginRouter'

export default combineRouters(publicRouter, loginRouter)
