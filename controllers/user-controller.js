const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res, next) => {
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
      .then(() => {
        req.flash('success_messages', '成功註冊帳號!')
        res.redirect('/signin')
      })
      // 接住前面拋出來的錯誤，呼叫專門做錯誤處理的middlewares
      .catch(error => next(error))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('/restaurants')
  },
  signOut: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController
