const mongoose = require('mongoose')
const Tour = require('../models/tourModel')

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
	
	this.populate({
		path: 'user',
		select: 'name'
	})

	next()
})

reviewSchema.statics.calcAveragRatings = async function(tourId) {
	const stats = await this.aggregate([
		{
			$match: {
				tour: tourId
			}
		},
		{
			$group: {
				_id: '$tour',
				nRating: {
					$sum: 1
				},
				avgRating: {
					$avg: '$rating'
				}
			}
		}
	])

	if (stats.length > 0) {
		await Tour.findByIdAndUpdate(tourId, {
			ratingsQuantity: stats[0].nRating,
			ratingsAverage: stats[0].avgRating
		})
	} else {
		await Tour.findByIdAndUpdate(tourId, {
			ratingsQuantity: 0,
			ratingsAverage: 4.5
		})
	}
}

reviewSchema.post('save', function() {
	this.constructor.calcAveragRatings(this.tour)
})

reviewSchema.pre(/^findOneAnd/, async function(next) {
	this.r = await this.findOne()
	console.log(this.r)

	next()
})

reviewSchema.post(/^findOneAnd/, async function() {
	await this.r.constructor.calcAveragRatings(this.r.tour)
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review