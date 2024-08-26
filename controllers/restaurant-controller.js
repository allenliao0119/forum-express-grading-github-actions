const { Restaurant, Category } = require('../models')
const restaurantController = {
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
  }
}
module.exports = restaurantController
