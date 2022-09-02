const { promisify } = require('util')
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
	const {name, email, password, passwordConfirm, passwordChangedAt} = req.body
	
	const newUser = await User.create({
		name,
		email,
		password,
		passwordConfirm,
		passwordChangedAt
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
			return next( new AppError('Incorrect email or password!', 401) )
		}
	} else {
		return next( new AppError('Incorrect email or password!', 401) )
	}

	// send back the token
	const token = signToken(user._id)

	res.status(200).json({
		status: 'Success',
		token
	})
})

const protect = catchAsync(async (req, res, next) => {
	const {authorization} = req.headers
	let token

	// 1. Get token and check if it's available!
	if (authorization && authorization.startsWith('Bearer')) {
		token = authorization.split(' ')[1]
	}

	if (!token) {
		return next(new AppError('You\'re not loggin in!', 401))
	}

	// 2. Validate token!
	const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
	console.log(decodedToken)

	// 3. Check if user still exists!
	const currentUser = await User.findById(decodedToken.id)
	if (!currentUser) {
		return next( new AppError('The token belonging to this user doesn\'t exist', 401) )
	}

	// 4. Check if user changed password after token has changed!
	if (currentUser.changedPasswordAfterTokenIssued(decodedToken.iat)){
		return next(new AppError('User changed password recently! Please login again!', 401))
	}

	// Grant Access to protected route!!
	req.user = currentUser
	next()
})

module.exports = {
	signup,
	login,
	protect
}