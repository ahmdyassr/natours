const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	duration: {
		type: Number,
		required: true
	},
	maxGroupSize: {
		type: Number,
		required: true
	},
	difficulty: {
		type: String,
		required: true
	},
	ratingsAverage: {
		type: String,
		default: 4.5
	},
	ratingsQuantity: {
		type: Number,
		default: 0
	},
	price: {
		type: Number,
		required: true
	},
	priceDicsount: {
		type: Number
	},
	summary: {
		type: String,
		trim: true // remove white space at the begining and the end of the a string
	},
	imageCover: {
		type: String
	},
	images: [String],
	createdAt: {
		type: Date,
		default: Date.now()
	},
	startDates: [Date ]
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour