const { Restaurant, Category, Comment, User } = require('../models')
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
      include: [
        Category,
        { model: Comment, include: User }
      ],
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("restaurant didn't exist")
        return restaurant.increment('viewCounts', { by: 1 })
      })
      .then(restaurant => {
        res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      attributes: ['name', 'viewCounts'],
      include: [Category, Comment]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("restaurant didn't exist")
        restaurant = restaurant.toJSON()
        const commentCount = restaurant.Comments ? restaurant.Comments.length : '-'
        res.render('dashboard', {
          restaurant,
          commentCount
        })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    Promise.all([
      Restaurant.findAll({
        include: [Category],
        limit: 20,
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      }),
      Comment.findAll({
        include: [Restaurant],
        limit: 20,
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
    ])
      .then(([restaurants, comments]) => {
        const DEFAULT_TEXT_LIMIT = 100
        const restaurantsData = restaurants.map(restaurant => {
          // 如果文字超過DEFAULT_TEXT_LIMIT，則擷取文字，並加上'...'表示文字未完
          return (restaurant.description.length > DEFAULT_TEXT_LIMIT) ? ({ ...restaurant, description: restaurant.description.substring(0, DEFAULT_TEXT_LIMIT) + '...' }) : restaurant
        })
        const commentsData = comments.map(comment => {
          // 如果文字超過DEFAULT_TEXT_LIMIT，則擷取文字，並加上'...'表示文字未完
          return (comment.text.length > DEFAULT_TEXT_LIMIT) ? ({ ...comment, text: comment.text.substring(0, DEFAULT_TEXT_LIMIT) } + '...') : comment
        })
        res.render('feeds', {
          restaurants: restaurantsData,
          comments: commentsData
        })
      })
      .catch(err => next(err))
  }
}
module.exports = restController
