const express = require('express')
const router = express.Router()

const upload = require('../../../middlewares/multer')
const adminController = require('../../../controllers/apis/admin-controller')
const categoryController = require('../../../controllers/apis/category-controller')

router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/restaurants', adminController.getRestaurants)

router.patch('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)

router.put('/categories/:id', categoryController.putCategory)
router.delete('/categories/:id', categoryController.deleteCategory)
router.post('/categories', categoryController.postCategory)

module.exports = router
