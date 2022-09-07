const Review = require('../models/reviewModel')
const {createOne, getOne, updateOne, deleteOne, getAll} = require('./handlerFactory')

const setTourUserId = (req, res, next) => { // Allow nested routes
	if (!req.body.tour) {
		req.body.tour = req.params.tourId
	}

	if (!req.body.user) {
		req.body.user = req.user.id
	}

	next()
}

const getReview = getOne(Review)
const createReview = createOne(Review)
const updateReview = updateOne(Review)
const deleteReview = deleteOne(Review)
const getReviews = getAll(Review)

module.exports = {
	setTourUserId,
	createReview,
	getReview,
	updateReview,
	deleteReview,
	getReviews
}