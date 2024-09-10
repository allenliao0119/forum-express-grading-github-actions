const { Restaurant, Category, Comment, User, Favorite } = require('../../models')
const { getUser } = require('../../helpers/auth-helpers')
const restaurantServices = require('../../services/restaurant-services')
const restController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('restaurants', data))
  },
  getRestaurant: (req, res, next) => {
    restaurantServices.getRestaurant(req, (err, data) => err ? next(err) : res.render('restaurant', data))
  },
  getDashboard: (req, res, next) => {
    restaurantServices.getDashboard(req, (err, data) => err ? next(err) : res.render('dashboard', data))
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
          return restaurant.description?.length > DEFAULT_TEXT_LIMIT ? ({ ...restaurant, description: restaurant.description.substring(0, DEFAULT_TEXT_LIMIT) + '...' }) : restaurant
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
  },
  getTopRestaurants: (req, res, next) => {
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
        res.render('top-restaurants', { restaurants: result })
      })
      .catch(err => next(err))
  }
}
module.exports = restController
