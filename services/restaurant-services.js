const { Restaurant, Category, Comment, User, Favorite } = require('../models')
const { getUser } = require('../helpers/auth-helpers')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantServices = {
  getRestaurants: (req, callback) => {
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
        const favoritedRestaurantId = req.user?.FavoritedRestaurants ? req.user.FavoritedRestaurants.map(fr => fr.id) : []
        const likedRestaurants = req.user?.LikedRestaurants ? req.user.LikedRestaurants.map(lr => lr.id) : []
        const data = restaurants.rows.map(restaurant => {
          return {
            ...restaurant,
            description: restaurant.description?.substring(0, DEFAULT_DESCRIPTION_LIMIT),
            isFavorited: req.user && favoritedRestaurantId.includes(restaurant.id),
            isLiked: req.user && likedRestaurants.includes(restaurant.id)
          }
        })
        return callback(null, {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => callback(err))
  },
  getRestaurant: (req, callback) => {
    Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ],
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("restaurant didn't exist")
        return restaurant.increment('viewCounts', { by: 1 })
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(user => user.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(user => user.id === req.user.id)
        return callback(null, {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
      })
      .catch(err => callback(err))
  },
  getDashboard: (req, callback) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, {
        attributes: ['name', 'viewCounts'],
        include: [Category, Comment]
      }),
      Favorite.findAndCountAll({
        where: { restaurantId: req.params.id }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("restaurant didn't exist")
        restaurant = restaurant.toJSON()
        const commentCount = restaurant.Comments ? restaurant.Comments.length : '-'
        const favoritedCount = favorite.count || '-'
        return callback(null, {
          restaurant,
          commentCount,
          favoritedCount
        })
      })
      .catch(err => callback(err))
  },
  getFeeds: (req, callback) => {
    return Promise.all([
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
          return restaurant.description?.length > DEFAULT_TEXT_LIMIT ? ({ ...restaurant, description: restaurant.description.substring(0, DEFAULT_TEXT_LIMIT) + '...' }) : restaurant
        })
        const commentsData = comments.map(comment => {
          // 如果文字超過DEFAULT_TEXT_LIMIT，則擷取文字，並加上'...'表示文字未完
          return (comment.text.length > DEFAULT_TEXT_LIMIT) ? ({ ...comment, text: comment.text.substring(0, DEFAULT_TEXT_LIMIT) } + '...') : comment
        })
        return callback(null, {
          restaurants: restaurantsData,
          comments: commentsData
        })
      })
      .catch(err => callback(err))
  },
  getTopRestaurants: (req, callback) => {
    return Restaurant.findAll({
      include: [
        { model: User, as: 'FavoritedUsers' }
      ]
    })
      .then(restaurants => {
        const result = restaurants
          .map(restaurant => {
            return {
              ...restaurant.toJSON(),
              favoritedCount: restaurant.FavoritedUsers.length,
              isFavorited: getUser(req) && getUser(req).FavoritedRestaurants.some(favoriteRest => favoriteRest.id === restaurant.id)
            }
          })
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)
        return callback(null, { restaurants: result })
      })
      .catch(err => callback(err))
  }
}

module.exports = restaurantServices
