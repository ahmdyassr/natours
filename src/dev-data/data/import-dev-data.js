const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('../../models/tourModel')
const User = require('../../models/userModel')
const Review = require('../../models/reviewModel')

// GRAB ENV VARIABLES

dotenv.config({
	path: path.resolve(`${__dirname}../../../config.env`)
})

//CONNECT TO DB
mongoose
	.connect(
		process.env.MONGO_URI.replace('<PASSWORD>', process.env.MONGO_PASSWORD)
	).then(() => {  
		console.log('Connected to Database! 🏄‍♂️')
	}).catch((e) => {
		console.log(e)
	})


// READ FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'))

// IMPORT DATA INTO DB
const importData = async () => {
	try {
		await Tour.create(tours)
		await User.create(users, {validateBeforeSave: false})
		await Review.create(reviews)
		console.log('Data created successfully ✅')
		process.exit()
	} catch(e) {
		console.log(e)
	}
}

const deleteAllData = async () => {
	try {
		await Tour.deleteMany()
		await User.deleteMany()
		await Review.deleteMany()
		console.log('Data deleted successfully 🗑')
		process.exit()
	} catch(e) {
		console.log(e)
	}
}

if (process.argv[2] === '--import') {
	importData()
} else if (process.argv[2] === '--delete') {
	deleteAllData()
}





