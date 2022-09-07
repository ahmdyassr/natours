const express = require('express')
const { setTourUserId, createReview, getReview, updateReview, deleteReview, getReviews } = require('../controllers/reviewController.js')
const {protect, restrictTo} = require('../controllers/authController')

const router = express.Router({
	mergeParams: true
})

router
	.route('/')
	.get(getReviews)
	.post(protect, restrictTo('user'), setTourUserId, createReview)

router
	.route('/:id')
	.get(getReview)
	.patch(updateReview)
	.delete(deleteReview)
	

module.exports = router