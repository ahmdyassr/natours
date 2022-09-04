const crypto = require('crypto')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const sendEmail = require('../utils/email')

const signToken = (id) => {
	return jwt.sign({
		id,
	}, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRATION_DURATION
	})
}

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id)
	
	res.status(201).json({
		status: 'success',
		token,
		data: {
			user
		}
	})
}

const signup = catchAsync(async (req, res, next) => {
	const {name, email, password, passwordConfirm, passwordChangedAt, role} = req.body
	
	const newUser = await User.create({
		name,
		email,
		password,
		passwordConfirm,
		passwordChangedAt,
		role
	})

	createSendToken(newUser, 201, res)
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
	createSendToken(user, 200, res)
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

const restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError('You don\'t have permission to perform this task', 403)
			)
		}

		next()
	}
}

const forgotPassword = catchAsync(async (req, res, next) => {
	const user = await User.findOne({
		email: req.body.email
	})

	if (!user) {
		return next(new AppError('There is no user with this email address', 404))
	}

	const resetToken = user.createPasswordResetToken()
	await user.save({ validateBeforeSave: false })

	const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
	const message = `Forgot your password? Sybmit a patch request with your new password to ${resetUrl}`

	try {
		await sendEmail({
			email: user.email,
			subject: 'Your password reset token (valid for 10 min)',
			message
		})
	
		res.status(200).json({
			status: 'Success',
			message: 'Token to email!'
		})
	} catch(e) {
		user.passwordResetToken = undefined
		user.passwordResetExpirationDuration = undefined

		await user.save({
			validateBeforeSave: false
		})

		return next(new AppError('There was an error sending the email. Try again later!', 500))
	}
	
})

const resetPassword = catchAsync(async (req, res, next) => {

	// Get user based on token
	const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpirationDuration: {
			$gt: Date.now()
		}
	})
	
	// Check if token is xpired and there is user, set new token
	if (!user) {
		return next(new AppError('Token is invalid or expired!!!', 400))
	}

	// Update changePasswordAt property
	user.password = req.body.password 
	user.passwordConfirm  = req.body.password
	user.passwordResetToken = undefined
	user.passwordResetExpirationDuration = undefined
	await user.save()

	// Log user in
	createSendToken(user, 201, res)
})

const updatePassword  = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password')
 
	if (!(await user.verifyPassword(req.body.currentPassword, user.password))) {
		return next(new AppError('Youd didn\'t provide the correct current password'))
	}

	user.password = req.body.password
	user.passwordConfirm = req.body.password 
	await user.save()

	createSendToken(user, 201, res)
})

module.exports = {
	signup,
	login,
	protect,
	restrictTo,
	forgotPassword,
	resetPassword,
	updatePassword 
}