import User from './test'

// 增
const user = {
  name: 'junjun-lilili',
  age: 18,
  email: '11776174@qq.com'
}

const insertMethods = async () => {
  const data = new User(user)
  const result = await data.save()
  console.log(result)
}
// const data = new User(user)
// data.save().then((res) => {
//   console.log(res)
// })

// 查询
const findMethods = async () => {
  const result = await User.find()
  console.log(result)
}

// 修改
const updateMethods = async () => {
  const result = await User.updateOne(
    {
      name: 'junjun'
    },
    {
      email: '哈哈哈 被我修改了'
    }
  )
  console.log(result)
}

const deleteMethods = async () => {
  const result = await User.deleteOne(
    {
      name: 'junjun'
    }
  )
  console.log(result)
}
deleteMethods()