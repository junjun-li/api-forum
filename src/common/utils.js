import { getValue } from '@/config/RedisConfig'

/**
 * 判断redis中是否存在sid和验证码是否正确
 * @param {string} key sid
 * @param {string} value code
 */
export const checkCode = async (key, value) => {
  let redisData = await getValue(key)
  console.log(redisData)
  // 如果有这个 sid
  // 能取到切不为null 不为undefined 不为''
  if (redisData) {
    // 比较是否匹配
    if (redisData.toLowerCase() === value.toLowerCase()) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}
