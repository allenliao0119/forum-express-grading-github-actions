const { Restaurant, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_PAGINATION_LIMIT = 9
    const DEFAULT_DESCRIPTION_LIMIT = 50
    const limit = Number(req.query.limit) || DEFAULT_PAGINATION_LIMIT
    const page = Number(req.query.page) || 1
    const offset = getOffset(limit, page)
    const categoryId = Number(req.query.categoryId) || ''
    return Promise.all([
      Restaurant.findAndCountAll({
        where: categoryId ? { categoryId } : {},
        include: [Category],
        offset,
        limit,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.rows.map(restaurant => {
          return {
            ...restaurant,
            description: restaurant.description.substring(0, DEFAULT_DESCRIPTION_LIMIT)
          }
        })
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      include: [Category],
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("restaurant didn't exist")
        return restaurant.increment('viewCounts', { by: 1 })
      })
      .then(restaurant => res.render('restaurant', { restaurant: restaurant.toJSON() }))
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      attributes: ['name', 'viewCounts'],
      include: [Category],
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("restaurant didn't exist")
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = restController
