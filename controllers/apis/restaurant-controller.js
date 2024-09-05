const { Restaurant, Category } = require('../../models')
const { getOffset, getPagination } = require('../../helpers/pagination-helper')

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
        const favoritedRestaurantId = req.user?.FavoritedRestaurants ? req.user.FavoritedRestaurants.map(fr => fr.id) : []
        const likedRestaurants = req.user?.LikedRestaurants ? req.user.LikedRestaurants.map(lr => lr.id) : []
        const data = restaurants.rows.map(restaurant => {
          return {
            ...restaurant,
            description: restaurant.description.substring(0, DEFAULT_DESCRIPTION_LIMIT),
            isFavorited: req.user && favoritedRestaurantId.includes(restaurant.id),
            isLiked: req.user && likedRestaurants.includes(restaurant.id)
          }
        })
        return res.json({
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => next(err))
  }
}

module.exports = restController
