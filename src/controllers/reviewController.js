const Review = require('../models/reviewModel')
const catchAsync = require('../utils/catchAsync')
const {deleteOne} = require('./handlerFactory')

const createReview = catchAsync(async (req, res) => {
	
	if (!req.body.tour) {
		req.body.tour = req.params.tourId
	}

	if (!req.body.user) {
		req.body.user = req.user.id
	}

	const {review, rating, user, tour} = req.body
	
	const newReview = await Review.create({
		review, 
		rating, 
		user,
		tour
	})

	res.status(201).json({
		status: 'Success',
		data: {
			review: newReview
		}
	})
})

const getReviews = catchAsync(async (req, res) => {
	let filter
	if (req.params.tourId) {
		filter = {
			tour: req.params.tourId
		}
	}

	const reviews = await Review.find(filter)

	res.status(200).json({
		status: 'Success',
		results: reviews.length,
		data: {
			reviews
		}
	})
})

const deleteReview = deleteOne(Review)

module.exports = {
	createReview,
	getReviews,
	deleteReview
}