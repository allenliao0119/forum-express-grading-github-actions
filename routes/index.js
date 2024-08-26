const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middlewares/error-handler')
const { authenticated, authenticatedAdmin } = require('../middlewares/auth')

const admin = require('./modules/admin')

router.use(express.urlencoded({ extended: true }))

router.use('/admin', authenticatedAdmin, admin)
router.get('/signup', userController.signUpPage)
router.get('/signin', userController.signInPage)
router.get('/logout', userController.signOut)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)

router.post('/signup', userController.signUp)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureMessage: true }), userController.signIn)
router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
