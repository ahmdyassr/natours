const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

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

module.exports = {
	deleteOne
}