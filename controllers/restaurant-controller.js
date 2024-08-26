const { Restaurant, Category } = require('../models')
const restController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: [Category],
      nest: true,
      raw: true
    })
      .then(restaurants => {
        const data = restaurants.map(restaurant => {
          return {
            ...restaurant,
            description: restaurant.description.substring(0, 50)
          }
        })
        res.render('restaurants', { restaurants: data })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      include: [Category],
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("restaurant didn't exist")
        restaurant.increment('viewCounts', { by: 1 })
          .then(() => res.render('restaurant', { restaurant }))
      })
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
