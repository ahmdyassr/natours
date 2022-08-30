const fs = require('fs')
const express = require('express')
const router = express.Router()

// DATABASE
const toursData = JSON.parse(
	fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
)

// HANDLERS
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

	if (!tour) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid id '
		})
	}

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

	if (!tour) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid id'
		})
	}

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


router
	.route('/')
	.get(getAllTours)
	.post(createTour)

router
	.route('/:id')
	.get(getTour)
	.patch(updateTour)
	.delete(deleteTour)

module.exports = router