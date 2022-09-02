const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')

const getAllUsers = catchAsync(async (req, res) => {
	const users = await User.find()

	res.status(500).json({
		status: 'Success',
		results: users.length,
		data: {
			users
		}
	})
})

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

module.exports = {
	getAllUsers,
	createUser,
	getUser,
	updateUser,
	deleteUser
}
