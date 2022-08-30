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

const tourSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A tour mush have a name!'],
		unique: true
	},
	rating: {
		type: String,
		default: 4.5
	},
	price: {
		type: Number,
		required: [true, 'A tour must have a price!']
	}
})

const Tour = mongoose.model('Tour', tourSchema)

const testTour = new Tour({
	name: 'The Forest Hiker',
	price: 200,
	rating: 4.8
})

testTour
	.save()
	.then((tour) => {
		console.log(tour)
	}).catch((e) => {
		console.log(e)
	}) 
	
// START SERVER
app.listen(process.env.PORT, () => {
	console.log(`Server is listening on PORT: ${process.env.PORT}`)
})