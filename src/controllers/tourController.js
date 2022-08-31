const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/APIFeatures')

const aliasTopTours = async (req, res, next) => {
	req.query.limit = '5'
	req.query.sort = '-ratingsAverage,price'
	req.query.fields = 'name, price, ratingsAverage, summary, difficulty'

	next()
}

const getAllTours = async (req, res) => {
	try {
		
		// Execute query
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