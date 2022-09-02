const AppError = require('../utils/appError')

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}`	 

	return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err) => {
	const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]
	const message =`Duplicate field value for ${value}. Please use another value!`

	return new AppError(message, 400)
}

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map(el => el.message)

	const message = `Invalid input data! ${errors.join('. ')}`
	return new AppError(message, 400)
}

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		err: err,
		message: err.message,
		stack: err.stack
	})
}

const sendErrorProd = (err, res) => {
	if(err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			err: err,
			message: err.message,
			stack: err.stack
		})
	} else {
		console.log('Error 🔥', err)

		res.status(500).json({
			status: 'Error!',
			message: 'Something went very wrong!'
		})
	}
	
}

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500
	err.status = err.status || 'Error'

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res)
	} else if (process.env.NODE_ENV === 'production') {
		let error = {...err}

		if (error.name === 'CastError') {
			error = handleCastErrorDB(error)
		}

		if (error.code === 11000) {
			error = handleDuplicateFieldsDB(error)
		}

		if (err.name === 'ValidationError') {
			error = handleValidationErrorDB(error)
		}

		sendErrorProd(err, res)
	}

	next()
}