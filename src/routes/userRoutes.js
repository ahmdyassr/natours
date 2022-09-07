const express = require('express')
const router = express.Router()
const {getAllUsers, createUser, getUser, updateUser, deleteUser, getMe, updateMe, deleteMe} = require('../controllers/userController')
const {signup, login, forgotPassword, resetPassword, updatePassword, protect} = require('../controllers/authController')

router.post('/signup', signup)
router.post('/login', login)
router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)

router
	.use(protect)

router
	.get('/me', getMe, getUser) 

router
	.patch(
		'/updatePassword',  
		updatePassword
	)

router
	.patch(
		'/updateMe', 
		updateMe
	)

router
	.delete(
		'/deleteMe',  
		deleteMe
	)


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