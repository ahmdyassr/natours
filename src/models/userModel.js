const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

// name, email, photo, password, password confirmation

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	role: {
		type: String,
		enum: ['user', 'guide', 'lead-guide', 'admin'],
		default: 'user'
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		validate: validator.isEmail
	},
	password: {
		type: String,
		required: true,
		minLength: 8,
		select: false
	},
	passwordConfirm: {
		type: String,
		required: true,
		validate: {
			validator: function(el) { // validator should always return either true or false
				return el === this.password
			}
		}
	},
	photo: String,
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpirationDuration: Date,
	active: {
		type: Boolean,
		default: true,
		select: false
	}
})

// (Document Middleware) Hash the passowrd
userSchema.pre('save', async function(next) {

	// Only run if password is modified
	if(!this.isModified('password')) {
		return next()
	}

	// Hash and remove confirmed password
	this.password = await bcrypt.hash(this.password, 12)
	this.passwordConfirm = undefined

	next()
})

userSchema.pre('save', function(next) {
	if (!this.isModified('password') || this.isNew) {
		return next()
	}

	this.passwordChangedAt = Date.now() - 1000

	next()
})

userSchema.pre(/^find/, function(next) {
	// this points to the current query
	this.find({
		active: {
			$ne: false
		}
	})

	next()
})

// (Schema Method) Verify password
userSchema.methods.verifyPassword = async function(clientPassword, userPassword) {
	return await bcrypt.compare(clientPassword, userPassword)
}

userSchema.methods.changedPasswordAfterTokenIssued =  function(JWTtimeStamp) {
	if (!this.passwordChangedAt) {
		return false
	}
	
	const changedTimeStamp = parseInt(
		this.passwordChangedAt.getTime() / 1000,
		10
	)
	return JWTtimeStamp < changedTimeStamp
}

userSchema.methods.createPasswordResetToken = function() {
	const resetToken = crypto.randomBytes(32).toString('hex')
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
	this.passwordResetExpirationDuration = Date.now() + 10 * 60 * 1000

	return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User

