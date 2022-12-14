const path = require('path')
const express = require('express')
const pino = require('pino-http')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')

const app = express()

// MIDDLEWARES

// Set template engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Serve statice files
app.use(express.static(path.join(__dirname, 'public')))

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
	limit: '2MB'
})) 

// Data Sanitization
app.use(mongoSanitize())

// ROUTES
app.get('/', (req, res) => {
	res.status(200).render('base')
})

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)

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