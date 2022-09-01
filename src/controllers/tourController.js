const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/APIFeatures')
const catchAsync = require('../utils/catchAsync')

const aliasTopTours = async (req, res, next) => {
	req.query.limit = '5'
	req.query.sort = '-ratingsAverage,price'
	req.query.fields = 'name, price, ratingsAverage, summary, difficulty'

	next()
}
 
const getAllTours = catchAsync(async (req, res) => {
	const features = new APIFeatures(Tour.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate()

	const tours = await features.query

	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: {
			tours
		}
	})
})

const createTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.create(req.body)

	res.status(201).json({
		status: 'success',
		data: {
			tour
		}
	})
})

const getTour = catchAsync(async (req, res) => {
	const tour = await Tour.findById(req.params.id)

	res.status(200).json({
		status: 'success',
		data: {
			tour
		}
	})
})

const updateTour = catchAsync(async (req, res) => {
	const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	})

	res.status(201).json({
		status: 'success',
		data: {
			tour
		}
	})
})

const deleteTour = catchAsync(async (req, res) => {
	await Tour.findByIdAndDelete(req.params.id, req.body)

	res.status(204).json({
		status: 'success',
		data: null
	})
})

const getTourStats = catchAsync(async (req, res) => {
	const stats = await Tour.aggregate([
		{
			$match: { 
				price: { $gte:  200 }
			}
		},
		{
			$group: {
				_id: { 
					$toUpper: '$difficulty' 
				},
				numTours: {
					$sum: 1
				},
				numRatings: {
					$sum: '$ratingsQuantity'
				},
				avgRating: {
					$avg: '$ratingsAverage'
				},
				avgPrice: {
					$avg: '$price'
				},
				minPrice: {
					$min: '$price'
				},
				maxPrice: {
					$max: '$price'
				} 
			}
		},
		{
			$sort: {
				avgPrice: 1
			}
		}
	])

	res.status(200).json({
		status: 'success',
		data: {
			stats
		}
	})
})

const getMonthlyPlan = catchAsync(async (req, res) => {
	const year = parseInt(req.params.year)
	const plan = await Tour.aggregate([
		{
			$unwind: '$startDates'
		},
		{
			$match: {
				startDates: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`)
				}
			}
		}, 
		{
			$group: {
				_id: {
					$month: '$startDates'
				}, 
				numTourStarts: {
					$sum: 1
				},
				tours: {
					$push: '$name'
				}
			}
		},
		{
			$addFields: {
				month: '$_id'
			}
		}, 
		{
			$project: {
				_id: 0
			}
		}, 
		{
			$sort: {
				numTourStarts: -1
			}
		},
		{
			$limit: 12
		}
	])

	res.status(200).json({
		status: 'success',
		data: {
			plan
		}
	})
})

module.exports = {
	aliasTopTours,
	getTourStats,
	getMonthlyPlan,
	getAllTours,
	createTour,
	getTour,
	updateTour,
	deleteTour
}