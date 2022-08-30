const express = require('express')
const router = express.Router()

// HANDLERS
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

router
	.route('/')
	.get(getAllUsers)
	.post(createUser)

router	
	.route('/:id')
	.get(getUser)
	.patch(updateUser)
	.delete(deleteUser)

module.exports = router