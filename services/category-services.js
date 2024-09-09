const { Category } = require('../models')

const categoryServices = {
  postCategory: (req, res, callback) => {
    const { name } = req.body
    if (!name) throw new Error('category name is required')
    return Category.create({ name })
      .then(data => {
        callback(null, { category: data.toJSON() })
      })
      .catch(err => callback(err))
  }
}

module.exports = categoryServices
