const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const filterObj = (obj, ...allowedFields) => {
	const newObj = {}

	Object.keys(obj).forEach(el => {
		if (allowedFields.includes(el)) {
			newObj[el] = obj[el]
		}
	})

	return newObj
}

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

const updateMe = catchAsync(async (req, res, next) => {
	if (req.body.password || req.body.passwordConfirm) {
		return next(new AppError('This rount isn\'t for password updates!!', 400))
	}

	// const filterBody
	const filterBody = filterObj(req.body, 'name', 'email')
	const user = await User.findByIdAndUpdate(req.user.id, filterBody, {
		new: true,
		runValidators: true
	})
	await 

	res.status(200).json({
		status: 'Success',
		user
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
	updateMe,
	getUser,
	updateUser,
	deleteUser
}
