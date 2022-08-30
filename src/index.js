const fs = require('fs')
const express = require('express')
const pino = require('pino-http')
const app = express()

//
// Database
//
const toursData = JSON.parse(
	fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
)

//
// Middlewares
//

// Insert incoming body request into req.body
app.use(express.json()) 


// Logging
app.use(pino())


//
// Route handlers
//

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

const getAllUsers = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route isn\'t yet defined!'
	})
}

const createUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route isn\'t yet defined!'
	})
}

const getUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route isn\'t yet defined!'
	})
}

const updateUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route isn\'t yet defined!'
	})
}

const deleteUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route isn\'t yet defined!'
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

app
	.route('/api/v1/users')
	.get(getAllUsers)
	.post(createUser)

app	
	.route('/api/v1/users/:id')
	.get(getUser)
	.patch(updateUser)
	.delete(deleteUser)

const port = 3000
app.listen(port, () => {
	console.log(`Server is listening on PORT: ${port}`)
})