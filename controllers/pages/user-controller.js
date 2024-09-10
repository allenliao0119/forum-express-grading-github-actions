const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../../models')
const { localFileHandler } = require('../../helpers/file-helpers')
const { getUser } = require('../../helpers/auth-helpers')
const userServices = require('../../services/user-services')
const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功註冊帳號!')
      res.redirect('/signin')
    })
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
    userServices.getUser(req, (err, data) => err ? next(err) : res.render('users/profile', data))
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
