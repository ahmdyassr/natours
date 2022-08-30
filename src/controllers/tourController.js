const fs = require('fs')

// DATABASE

const toursData = JSON.parse(
	fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
)

// CONTROLLERS

const checkID = (req, res, next, val) => {
	const id = parseInt(val)
	console.log(`Tour id is ${id} and its type is: ${typeof(id )}`)
	if (id > toursData.length) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID!'
		})
	}

	next()
}

const getAllTours = (req, res) => {
	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: toursData.length,
		data: {
			tours: toursData
		}
	})
}

const createTour = (req, res) => {
	const newId = toursData[toursData.length - 1].id + 1
	const newTour = Object.assign({
		id: newId
	}, req.body)

	toursData.push(newTour)
	fs.writeFile(
		`${__dirname}/dev-data/data/tours-simple.json`, 
		JSON.stringify(toursData),
		() => {
			res.status(201).json({
				status: 'success',
				data: {
					tour: newTour
				}
			})
		}
	)
}

const getTour = (req, res) => {
	const id = parseInt(req.params.id)
	const tour = toursData.find(el => el.id === id)

	res.status(200).json({
		status: 'success',
		data: {
			tour
		}
	})
}

const updateTour = (req, res) => {
	const id = parseInt(req.params.id)
	const tour = toursData.find(el => el.id === id)

	res.status(200).json({
		status: 'success',
		data: {
			tour: 'Updated tour data is here!'
		}
	})
}

const deleteTour = (req, res) => {
	const id = parseInt(req.params.id)
	const tour = toursData.find(el => el.id === id) 

	if (!tour) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid id'
		})
	}

	res.status(200).json({
		status: 'success',
		data: {
			tour: 'Deleted tour data is here!'
		}
	})
}

module.exports = {
	checkID,
	getAllTours,
	createTour,
	getTour,
	updateTour,
	deleteTour
}