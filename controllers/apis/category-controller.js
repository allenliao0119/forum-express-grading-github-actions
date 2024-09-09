const categoryServices = require('../../services/category-services')

const categoryController = {
  postCategory: (req, res, next) => {
    categoryServices.postCategory(req, res, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = categoryController
