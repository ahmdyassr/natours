const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app')

// GRAB ENV VARIABLES
dotenv.config({
	path: path.resolve(`${__dirname}/config.env`)
})

// CONNECT TO DB
mongoose
	.connect(
		process.env.MONGO_URI.replace('<PASSWORD>', process.env.MONGO_PASSWORD)
	).then(() => {
		console.log('Connected to Database! 🏄‍♂️')
	}).catch((e) => {
		console.log(e)
	})

	
// START SERVER
app.listen(process.env.PORT, () => {
	console.log(`Server is listening on PORT: ${process.env.PORT}`)
})