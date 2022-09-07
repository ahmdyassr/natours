const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const APIFeatures = require('../utils/APIFeatures')

const createOne = (Model) => {
	return catchAsync(async (req, res, next) => {
		const doc = await Model.create(req.body)

		if (!doc) {
			return next( AppError('No document found with that ID', 404) )
		}
		
		res.status(201).json({
			status: 'success',
			data: doc
		})
	})
}

const getOne = (Model, popOptions) => {
	return catchAsync(async (req, res, next) => {
		let query = Model.findById(req.params.id)

		if (popOptions) {
			query = query.populate(popOptions)
		}

		const doc = await query

		if (!doc) {
			return next( AppError('No document found with that ID', 404) )
		}
		
		res.status(201).json({
			status: 'success',
			data: doc
		})
	})
}

const updateOne = (Model) => {
	return catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		})

		if (!doc) {
			return next( AppError('No document found with that ID', 404) )
		}

		res.status(201).json({
			status: 'success',
			data: doc
		})
	})
}

const deleteOne = (Model) => {
	return catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id)

		if (!doc) {
			return next( AppError('No document found with that ID', 404) )
		}

		res.status(204).json({
			status: 'success',
			data: null 
		})
	})
}

const getAll = (Model) => {
	return catchAsync(async (req, res) => {
		// Allow for nested reviews on Tour [HACK!!!]
		let filter
		if (req.params.tourId) {
			filter = {
				tour: req.params.tourId
			}
		}

		const features = new APIFeatures(Model.find(filter), req.query)
			.filter()
			.sort()
			.limitFields()
			.paginate()
	
		const docs = await features.query
	
		res.status(200).json({
			status: 'success',
			results: docs.length,
			data: {
				docs
			}
		})
	})
}

module.exports = {
	createOne,
	getOne,
	updateOne,
	deleteOne,
	getAll
}