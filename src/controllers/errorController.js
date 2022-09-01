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
		sendErrorProd(err, res)
	}

	next()
}