const express = require('express')
const { createReview, getReviews, deleteReview } = require('../controllers/reviewController.js')
const {protect, restrictTo} = require('../controllers/authController')

const router = express.Router({
	mergeParams: true
})

router
	.route('/')
	.get(getReviews)
	.post(protect, restrictTo('user'), createReview)

router
	.route('/:id')
	.delete(deleteReview)

module.exports = router