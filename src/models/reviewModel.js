const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
	review: {
		type: String,
		required: true,
		trim: true
	},
	rating: {
		type: Number,
		min: 1,
		max: 5
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	tour: {
		type: mongoose.Schema.ObjectId,
		ref: 'Tour',
		required: true
	}
}, {
	toJSON: {
		virtuals: true
	},
	toObject: {
		virtuals: true
	}
})

// Query Middleware
reviewSchema.pre(/^find/, function(next) {

	// this.populate({
	// 	path: 'user',
	// 	select: 'name'
	// }).populate({
	// 	path: 'tour',
	// 	select: 'name'
	// })

	this.populate({
		path: 'user',
		select: 'name'
	})

	next()
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review