const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	rating: {
		type: String,
		default: 4.5
	},
	price: {
		type: Number,
		required: true
	}
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour