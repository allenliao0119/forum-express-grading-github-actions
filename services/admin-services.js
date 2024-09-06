const { Restaurant, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const adminServices = {
  getRestaurants: (req, callback) => {
    const DEFAULT_REST_LIMEIT = 20
    const page = Number(req.query.page) || 1
    console.log('page:', page)
    const offset = getOffset(DEFAULT_REST_LIMEIT, page)
    return Restaurant.findAndCountAll({
      include: [Category],
      raw: true,
      nest: true,
      offset,
      limit: DEFAULT_REST_LIMEIT
    })
      .then(restaurant => {
        const pagination = getPagination(DEFAULT_REST_LIMEIT, page, restaurant.count)
        return callback(null, {
          restaurants: restaurant.rows,
          pagination
        })
      })
      .catch(err => callback(err))
  }
}

module.exports = adminServices
