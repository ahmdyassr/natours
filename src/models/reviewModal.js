const mongoose = require('mongoose')
const User = require('./userModel')
const Tour = require('./tourModel')

const reviewSchema = new mongoose.Schema({
	review: {
		type: String,
		required: true,
		trim: true
	},
	rating: {
		type: Number,
		min: 1,
		max: 1
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
		type: mon goose.Schema.ObjectId,
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

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review