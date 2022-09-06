const express = require('express')
const { createReview, getReviews } = require('../controllers/reviewController.js')
const {protect, restrictTo} = require('../controllers/authController')

const router = express.Router({
	mergeParams: true
})

router
	.route('/')
	.post(protect, restrictTo('user'), createReview)
	.get(getReviews)

module.exports = router