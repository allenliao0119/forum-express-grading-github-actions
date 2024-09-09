const bcrypt = require('bcryptjs')

const { User } = require('../models')

const userServices = {
  signUp: (req, callback) => {
    // 如果兩次輸入密碼不同，建立Error物件並拋出去
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        // 如果email已存在，建立Error物件並拋出去
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(data => {
        delete data.password
        return callback(null, { user: data })
      })
      // 接住前面拋出來的錯誤，呼叫專門做錯誤處理的middlewares
      .catch(error => callback(error))
  }
}

module.exports = userServices
