const Review = require('../models/reviewModel')
const catchAsync = require('../utils/catchAsync')

const createReview = catchAsync(async (req, res) => {
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
	const reviews = await Review.find()

	res.status(200).json({
		status: 'Success',
		results: reviews.length,
		data: {
			reviews
		}
	})
})

module.exports = {
	createReview,
	getReviews
}