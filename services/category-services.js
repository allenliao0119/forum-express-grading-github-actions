const { Category } = require('../models')

const categoryServices = {
  getCategories: (req, callback) => {
    Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => callback(null, {
        categories,
        category
      }))
      .catch(err => callback(err))
  },
  postCategory: (req, callback) => {
    const { name } = req.body
    if (!name) throw new Error('category name is required')
    return Category.create({ name })
      .then(data => {
        return callback(null, { category: data.toJSON() })
      })
      .catch(err => callback(err))
  },
  putCategory: (req, callback) => {
    const { name } = req.body
    if (!name) throw new Error('category name is required')
    Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("category didn't exist")
        return category.update({ name })
      })
      .then(data => callback(null, { category: data }))
      .catch(err => callback(err))
  },
  deleteCategory: (req, callback) => {
    Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("category didn't exist")
        return category.destroy()
      })
      .then(data => callback(null, { category: data }))
      .catch(err => callback(err))
  }
}

module.exports = categoryServices
