const fs = require('fs')
const express = require('express')
const app = express()

// Middlewares
app.use(express.json()) // Insert incoming body request into req.body


const toursData = JSON.parse(
	fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
)

const getAllTours = (req, res) => {
	res.status(200).json({
		status: 'success',
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

app
	.route('/api/v1/tours')
	.get(getAllTours)
	.post(createTour)

app
	.route('/api/v1/tours/:id')
	.get(getTour)
	.patch(updateTour)
	.delete(deleteTour)

const port = 3000
app.listen(port, () => {
	console.log(`Server is listening on PORT: ${port}`)
})