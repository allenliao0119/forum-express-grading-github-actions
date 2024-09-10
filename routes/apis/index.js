const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const admin = require('./modules/admin')
const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller')
const categoryController = require('../../controllers/apis/category-controller')
const { apiErrorHandler } = require('../../middlewares/error-handler')
const { authenticated, authenticatedAdmin } = require('../../middlewares/api-auth')

router.use('/admin', authenticated, authenticatedAdmin, admin)

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/signup', userController.signUp)

router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)

router.get('/categories/:id', authenticated, categoryController.getCategories)

router.use('/', apiErrorHandler)

module.exports = router
