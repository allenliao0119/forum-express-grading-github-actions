const { Comment, Restaurant, User } = require('../models')
const { getUser } = require('../helpers/auth-helpers')

const commentController = {
  postComment: (req, res, next) => {
    const { text, restaurantId } = req.body
    const userId = getUser(req).id
    if (!text) throw new Error('text is required')
    if (!restaurantId) throw new Error('some parameters are missing value')
    Promise.all([
      Restaurant.findByPk(restaurantId),
      User.findByPk(userId)
    ])
      .then(([restaurant, user]) => {
        if (!restaurant) throw new Error("restaurant didn't exist")
        if (!user) throw new Error("User didn't exist")
        return Comment.create({
          text,
          restaurantId,
          userId
        })
      })
      .then(() => {
        req.flash('success_messages', 'Comment was successfully created')
        res.redirect(`/restaurants/${restaurantId}`)
      })
      .catch(err => next(err))
  }
}
module.exports = commentController
