const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Comment, Restaurant } = db
const { localFileHandler } = require('../helpers/file-helpers')
const { getUser } = require('../helpers/auth-helpers')
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
  },
  getUser: (req, res, next) => {
    if (Number(req.params.id) !== getUser(req).id) throw new Error('permission denied')
    return Promise.all([
      User.findByPk(req.params.id, { raw: true }),
      Comment.findAll({
        where: { userId: req.params.id },
        include: [Restaurant],
        nest: true,
        raw: true
      })
    ])
      .then(([user, comments]) => {
        console.log(comments)
        res.render('users/profile', { user, comments })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    if (Number(req.params.id) !== getUser(req).id) throw new Error('permission denied')
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("user didn't exist")
        res.render('users/edit', { user })
      })
  },
  putUser: (req, res, next) => {
    if (Number(req.params.id) !== getUser(req).id) throw new Error('permission denied')
    const { file } = req
    const { name } = req.body
    if (!name) throw new Error('name is required')
    return Promise.all([
      User.findByPk(req.params.id),
      localFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("user didn't exist")
        return user.update({
          name: req.body.name,
          image: filePath || user.image
        })
      })
      .then(user => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${user.id}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
