const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')

const adminController = require('../../controllers/apis/admin-controller')
const { apiErrorHandler } = require('../../middlewares/error-handler')

router.use('/admin', admin)
router.get('/restaurants', adminController.getRestaurants)
router.use('/', apiErrorHandler)

module.exports = router
