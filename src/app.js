const express = require('express')
const pino = require('pino-http')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

// MIDDLEWARES

// Insert incoming body request into req.body
app.use(express.json()) 

// Logging
if (process.env.NODE_ENV === 'development') {
	app.use(pino())
}

// Serve statice files
app.use(express.static(`${__dirname}/public`))

// ROUTES
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// Any router specified below will 
app.all('*', (req, res, next) => {
	next(new AppError(
		`Can't find ${req.originalUrl}`,
		404
	))
})

// Error Handling Middleware
app.use(globalErrorHandler)

module.exports = app 