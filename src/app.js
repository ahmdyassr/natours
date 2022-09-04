const express = require('express')
const pino = require('pino-http')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

// MIDDLEWARES

// Secure http headers
app.use(helmet())

// Logging
if (process.env.NODE_ENV === 'development') {
	app.use(pino())
}

// Limit request coming from the same IP
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP'
})

app.use('/api', limiter)

// Insert incoming body request into req.body
app.use(express.json({
	limit: '10kb '
})) 

// Data Sanitization
app.use(mongoSanitize())

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