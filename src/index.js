const express = require('express')
const pino = require('pino-http')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

// MIDDLEWARES

// Insert incoming body request into req.body
app.use(express.json()) 

// Logging
app.use(pino())

// ROUTES
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// START SERVER
const port = 3000
app.listen(port, () => {
	console.log(`Server is listening on PORT: ${port}`)
})
