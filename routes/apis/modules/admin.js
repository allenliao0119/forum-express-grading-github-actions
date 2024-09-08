const express = require('express')
const router = express.Router()

const upload = require('../../../middlewares/multer')
const adminController = require('../../../controllers/apis/admin-controller')

router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/restaurants', adminController.getRestaurants)

module.exports = router
