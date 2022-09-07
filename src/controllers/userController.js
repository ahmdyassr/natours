const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const {createOne, getOne, updateOne, deleteOne, getAll} = require('./handlerFactory')

const filterObj = (obj, ...allowedFields) => {
	const newObj = {}

	Object.keys(obj).forEach(el => {
		if (allowedFields.includes(el)) {
			newObj[el] = obj[el]
		}
	})

	return newObj
}

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

const deleteMe = catchAsync(async (req, res) => {
	await User.findByIdAndUpdate(req.user.id, {
		active: false
	})

	res.status(204).json({
		status: 'Success',
		data: null
	})
})

const getUser = getOne(User)
const createUser = createOne(User)
const updateUser = updateOne(User)
const deleteUser = deleteOne(User)
const getAllUsers = getAll(User)

module.exports = {
	getAllUsers,
	createUser,
	updateMe,
	deleteMe,
	getUser,
	updateUser,
	deleteUser
}
