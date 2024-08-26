const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => { res.render('admin/categories', { categories, category }) })
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('category name is required')
    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', 'category was successfully created')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('category name is required')
    Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("category didn't exist")
        return category.update({ name })
      })
      .then(() => {
        req.flash('success_messages', 'category was successfully updated')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("category didn't exist")
        return category.destroy()
      })
      .then(() => {
        req.flash('success_messages', 'category and related restaurants were successfully deleted')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}
module.exports = categoryController
