const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const signToken = (id) => {
	return jwt.sign({
		id,
	}, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRATION_DURATION
	})
}

const signup = catchAsync(async (req, res, next) => {
	const {name, email, password, passwordConfirm} = req.body
	
	const newUser = await User.create({
		name,
		email,
		password,
		passwordConfirm
	})

	const token = signToken(newUser._id)
	
	res.status(201).json({
		status: 'success',
		token,
		data: {
			user: newUser
		}
	})
})

const login = catchAsync(async (req, res, next) => {
	const {email, password} = req.body

	// check email and password
	if (!email || !password) {
		return next( new AppError('Please provide your email and password', 400) )
	}

	// check that the user exists & that the password is correct
	const user = await User.findOne({
		email
	}).select('+password')

	if (user) {
		const isPasswordCorrect = await user.verifyPassword(password, user.password)

		if (!isPasswordCorrect) {
			return next( new AppError('Incorrect email or password!', 400) )
		}
	} else {
		return next( new AppError('Incorrect email or password!', 400) )
	}

	// send back the token
	const token = signToken(user._id)

	res.status(200).json({
		status: 'Success',
		token
	})
})

module.exports = {
	signup,
	login
}