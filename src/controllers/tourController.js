const Tour = require('../models/tourModel')

const aliasTopTours = async (req, res, next) => {
	req.query.limit = '5'
	req.query.sort = '-ratingsAverage,price'
	req.query.fields = 'name, price, ratingsAverage, summary, difficulty'

	next()
}

const getAllTours = async (req, res) => {
	try {
		// Build Query
		const queryObject = {...req.query}
		const excludedFields = ['page', 'sort', 'limit', 'fields']
		excludedFields.forEach(el => delete queryObject[el])

		// Filtering
		let queryStr = JSON.stringify(queryObject)
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt )\b/g, match => `$${match}`)
		let query = Tour.find(JSON.parse(queryStr))

		// Sorting
		if (req.query.sort) {
			const sortBy = req.query.sort.split(',').join(' ')
			query = query.sort(sortBy)
		} else {
			query = query.sort('-createdAt')
		}

		// Limiting
		if (req.query.fields) {
			const fields = req.query.fields.split(',').join(' ')
			query = query.select(fields) // projecting
		} else {
			query = query.select('-__v')
		}

		// Pagination
		const page = parseInt(req.query.page) || 1
		const limit = parseInt(req.query.limit) || 100
		const skip = (page - 1) * limit
  
		query = query.skip(skip).limit(limit)

		if (req.query.page) {
			const toursNumber = await Tour.countDocuments()

			if (skip > toursNumber) {
				throw new Error('This page doesn\'t exists') 
			}
		}

		// Excute query
		const tours = await query
	
		res.status(200).json({
			status: 'success',
			results: tours.length,
			data: {
				tours
			}
		})
	} catch (e) {
		res.status(404).json({
			status: 'fail',
			message: e 
		})
	}
}

const createTour = async (req, res) => {
	try {
		const tour = await Tour.create(req.body)

		res.status(201).json({
			status: 'success',
			data: {
				tour
			}
		})
	} catch(e) {
		res.status(404).json({
			status: 'fail',
			message: e
		})
	}
}

const getTour = async (req, res) => {
	try {
		const tour = await Tour.findById(req.params.id)

		res.status(200).json({
			status: 'success',
			data: {
				tour
			}
		})
	} catch (e) {
		res.status(404).json({
			status: 'fail',
			message: e
		})
	}
}

const updateTour = async (req, res) => {
	try {
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
	} catch(e) {
		res.status(404).json({
			status: 'fail',
			message: e
		})
	}
}

const deleteTour = async (req, res) => {
	try {
		await Tour.findByIdAndDelete(req.params.id, req.body)

		res.status(204).json({
			status: 'success',
			data: null
		})
	} catch(e) {
		res.status(404).json({
			status: 'fail',
			message: e
		})
	}
}

module.exports = {
	aliasTopTours,
	getAllTours,
	createTour,
	getTour,
	updateTour,
	deleteTour
}