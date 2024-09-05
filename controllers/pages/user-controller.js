const bcrypt = require('bcryptjs')
const db = require('../../models')
const { User, Comment, Restaurant, Favorite, Like, Followship } = db
const { localFileHandler } = require('../../helpers/file-helpers')
const { getUser } = require('../../helpers/auth-helpers')
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
    const userId = req.params.id
    const isPersonal = Number(userId) === getUser(req).id
    return Promise.all([
      User.findByPk(userId, {
        include: [
          { model: Restaurant, as: 'FavoritedRestaurants' },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      Comment.findAll({
        where: { userId },
        include: [Restaurant],
        nest: true,
        raw: true
      })
    ])
      .then(([user, comments]) => {
        const filtedComments = []
        comments.forEach(comment => {
          if (!filtedComments.some(c => c.Restaurant.id === comment.Restaurant.id)) {
            filtedComments.push(comment)
          }
        })
        console.log(filtedComments)
        res.render('users/profile', {
          user: user.toJSON(),
          comments: filtedComments,
          commentCount: comments.length,
          favoritedCount: user.FavoritedRestaurants.length,
          followerCount: user.Followers.length,
          followingCount: user.Followings.length,
          isPersonal
        })
        // console.log(comments)
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
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          restaurantId,
          userId: getUser(req).id
        }
      })
    ])
      .then(([restaurant, favoritedRest]) => {
        if (!restaurant) throw new Error("restaurant didn't exist")
        if (favoritedRest) throw new Error('You have favorited this restaurant!')
        return Favorite.create({
          restaurantId,
          userId: getUser(req).id
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Favorite.findOne({
      where: {
        restaurantId,
        userId: getUser(req).id
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant")
        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const restaurantId = req.params.restaurantId
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: {
          userId: getUser(req).id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error("restaurant didn't exist")
        if (like) throw new Error('You have liked this restaurant!')
        return Like.create({
          userId: getUser(req).id,
          restaurantId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const restaurantId = req.params.restaurantId
    return Like.findOne({
      where: {
        userId: getUser(req).id,
        restaurantId
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't liked this restaurant!")
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getTopUsers: (req, res, next) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    })
      .then(users => {
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: getUser(req).Followings.some(following => following.id === user.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        res.render('top-users', { users: result })
      })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    const userId = req.params.userId
    return Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: getUser(req).id,
          followingId: userId
        }
      })
    ])
      .then(([user, following]) => {
        if (!user) throw new Error("user didn't exist")
        if (following) throw new Error('You have followed this user!')
        return Followship.create({
          followerId: getUser(req).id,
          followingId: userId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    const userId = req.params.userId
    return Followship.findOne({
      followerId: getUser(req).id,
      followingId: userId
    })
      .then(following => {
        if (!following) throw new Error("You haven't followed this user!")
        return following.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
