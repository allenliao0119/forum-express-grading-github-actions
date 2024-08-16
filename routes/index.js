const express = require('express')
const router = express.Router()

const restaurantsController = require('../controllers/restaurants-controller')

router.get('/restaurants', restaurantsController.getRestaurants)
router.use('/', (req, res) => res.redirect('restaurants'))

module.exports = router
