const express = require('express')
const { setTourUserId, createReview, getReview, updateReview, deleteReview, getReviews } = require('../controllers/reviewController.js')
const {protect, restrictTo} = require('../controllers/authController')

const router = express.Router({
	mergeParams: true
})

router.use(protect)

router
	.route('/')
	.get(getReviews)
	.post(restrictTo('admin', 'user'), setTourUserId, createReview)

router
	.route('/:id')
	.get(getReview)
	.patch(restrictTo('admin', 'user'), updateReview)
	.delete(restrictTo('admin', 'user'), deleteReview)
	

module.exports = router