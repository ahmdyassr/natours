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

// (Schema Method) Verify password
userSchema.methods.verifyPassword = async function(clientPassword, userPassword) {
	return await bcrypt.compare(clientPassword, userPassword)
}

const User = mongoose.model('User', userSchema)

module.exports = User

