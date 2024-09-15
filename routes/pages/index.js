const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const path = require('path')

const restController = require('../../controllers/pages/restaurant-controller')
const userController = require('../../controllers/pages/user-controller')
const commentController = require('../../controllers/pages/comment-controller')
const { generalErrorHandler } = require('../../middlewares/error-handler')
const { authenticated, authenticatedAdmin } = require('../../middlewares/auth')

const admin = require('./modules/admin')
const upload = require('../../middlewares/multer')

router.use('/upload', express.static(path.join(__dirname, 'upload')))

router.use('/admin', authenticatedAdmin, admin)

router.get('/oauth2/facebook/redirect', passport.authenticate('facebook', { failureRedirect: '/signin', failureMessage: true }))
router.get('/signin/facebook', passport.authenticate('facebook', { scope: ['email'] }))
router.get('/signup', userController.signUpPage)
router.get('/signin', userController.signInPage)
router.get('/logout', userController.signOut)
router.post('/signup', userController.signUp)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureMessage: true }), userController.signIn)

router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)

router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
