const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')
const User = require('./userModel')

const tourSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		maxLength: 40,
		minLength: 10,
		validate: {
			validator: (val) => validator.isAlpha(val, ['en-US'], {ignore: ' '}),
			message: 'A tour name must contain characters only'
		}
	},
	slug: {
		type: String,
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
		required: true,
		enum: ['easy', 'medium', 'difficult']
	},
	ratingsAverage: {
		type: Number,
		default: 4.5,
		min: 1,
		max: 5,
		set: val => Math.round(val * 10) / 10
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
		type: Number,
		validate: {
			validator: function(val) {
				// <this> points to the current document on a new docuement creation
				return val < this.price
			},
			message: 'Discount price should be below the regular price!'  
		}
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
	startDates: [Date],
	secretTour: {
		type: Boolean,
		default: false
	},
	startLocation: {
		type: {
			type: String,
			default: 'Point',
			enum: ['Point']
		},
		coordinates: [Number],
		address: String,
		description: String
	},
	locations: [
		{
			type: {
				type: String,
				default: 'Point',
				enum: ['Point']
			},
			coordinates: [Number],
			address: String,
			description: String,
			day: Number
		}
	],
	guides: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		}
	]
}, {
	toJSON: {
		virtuals: true
	},
	toObject: {
		virtuals: true
	}
})

tourSchema.index({
	price: 1,
	ratingsAverage: -1
})

tourSchema.index({
	slug: 1
})

tourSchema.virtual('durationWeeks').get(function() {
	return this.duration / 7
})

// Virtual populate
tourSchema.virtual('reviews', {
	ref: 'Review',
	foreignField: 'tour',
	localField: '_id'
})

// Document Middleware
tourSchema.pre('save', function(next) {
	this.slug = slugify(this.name, {lower: true })

	next( )
})

tourSchema.pre('save', async function(next) {

	const guidesPromises = this.guides.map((async id => {
		return await User.findById(id)
	}))

	this.guides = await Promise.all(guidesPromises)

	next()
})

// Query Middlewares
tourSchema.pre(/^find/, function(next) {
	this.find({
		secretTour: { $ne: true }
	})

	this.start = Date.now()
	next()
})

tourSchema.pre(/^find/, function(next) {
	this.populate({
		path: 'guides',
		select: '-__v -passwordChangedAt'
	})

	next()
})

tourSchema.post(/^find/, function(docs, next) {
	console.log(`Query took ${Date.now() - this.start} milliseconds! ⏰`)

	next()
})

// Aggregation Middleware
tourSchema.pre('aggregate', function(next) {
	this.pipeline().unshift({
		$match: {
			secretTour: {
				$ne: true
			}
		}
	})
 
	next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour