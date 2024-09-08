const { Restaurant, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { localFileHandler } = require('../helpers/file-helpers')

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
  },
  postRestaurant: (req, callback) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    localFileHandler(file)
      .then(filePath => {
        return Restaurant.create({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || null,
          categoryId
        })
      })
      .then(createdRestaurant => callback(null, { restaurant: createdRestaurant }))
      .catch(err => callback(err))
  },
  deleteRestaurant: (req, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.destroy()
      })
      .then(deletedRestaurant => callback(null, { restaurant: deletedRestaurant }))
      .catch(err => callback(err))
  }
}

module.exports = adminServices
