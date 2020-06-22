// mongoDB配置
const DB_URL = 'mongodb://test:123456@121.37.183.14:27017/testdb'

// redis配置
const REDISCONFIG = {
  host: '121.37.183.14',
  port: 15001,
  password: '123456'
}

// jwt_secrey密钥
const JWT_SECREY = 'IGc@I#^@*5A*v3i$eM4XGc0vEjw^JRQK0ZB#Y5RWP47G@LtVx2'

export default {
  DB_URL,
  REDISCONFIG,
  JWT_SECREY
}
