const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')
const upload = require('../../middlewares/multer')

router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.get('/users', adminController.getUsers)
router.get('/categories', categoryController.getCategories)
router.get('/categories/:id', categoryController.getCategories)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.post('/categories', categoryController.postCategory)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.put('/categories/:id', categoryController.putCategory)
router.patch('/users/:id', adminController.patchUser)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.delete('/categories/:id', categoryController.deleteCategory)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
