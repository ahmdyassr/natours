const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')
const {createOne, getOne, updateOne, deleteOne, getAll} = require('./handlerFactory')

const aliasTopTours = async (req, res, next) => {
	req.query.limit = '5'
	req.query.sort = '-ratingsAverage,price'
	req.query.fields = 'name, price, ratingsAverage, summary, difficulty'

	next()
}
 
const getTour = getOne(Tour, {
	path: 'reviews'
})

const getAllTours = getAll(Tour)
const createTour = createOne(Tour)
const updateTour = updateOne(Tour)
const deleteTour = deleteOne(Tour)

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