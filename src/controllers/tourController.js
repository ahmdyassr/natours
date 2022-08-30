const Tour = require('../models/tourModel')

const getAllTours = async (req, res) => {
	try {
		const tours = await Tour.find()
	
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
	getAllTours,
	createTour,
	getTour,
	updateTour,
	deleteTour
}