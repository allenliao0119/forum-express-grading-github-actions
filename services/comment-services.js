const { Comment, Restaurant, User } = require('../models')
const { getUser } = require('../helpers/auth-helpers')

const commentServices = {
  postComment: (req, callback) => {
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
      .then(createdComment => callback(null, { comment: createdComment }))
      .catch(err => callback(err))
  },
  deleteComment: (req, callback) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        if (!comment) throw new Error("comment didn't exist")
        return comment.destroy()
      })
      .then(deletedComment => callback(null, { comment: deletedComment }))
      .catch(err => callback(err))
  }
}

module.exports = commentServices
