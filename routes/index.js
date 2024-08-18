const express = require('express')
const router = express.Router()

const restaurantController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

const admin = require('./modules/admin')

router.use(express.urlencoded({ extended: true }))

router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/restaurants', restaurantController.getRestaurants)
router.use('/', (req, res) => res.redirect('restaurants'))

module.exports = router
