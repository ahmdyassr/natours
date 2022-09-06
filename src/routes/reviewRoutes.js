const express = require('express')
const router = express.Router()
const { createReview, getReviews } = require('../controllers/reviewController.js')
const {protect, restrictTo} = require('../controllers/authController')

router
	.route('/')
	.post(protect, restrictTo('user'), createReview)
	.get(getReviews)

module.exports = router