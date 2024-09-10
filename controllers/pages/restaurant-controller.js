const { Restaurant, Category, Comment, User, Favorite } = require('../../models')
const { getUser } = require('../../helpers/auth-helpers')
const restaurantServices = require('../../services/restaurant-services')
const restController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('restaurants', data))
  },
  getRestaurant: (req, res, next) => {
    restaurantServices.getRestaurant((err, data) => err ? next(err) : res.render('restaurant', data))
  },
  getDashboard: (req, res, next) => {
    restaurantServices.getDashboard(req, (err, data) => err ? next(err) : res.render('dashboard', data))
  },
  getFeeds: (req, res, next) => {
    restaurantServices.getFeeds(req, (err, data) => err ? next(err) : res.render('feeds', data))
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
