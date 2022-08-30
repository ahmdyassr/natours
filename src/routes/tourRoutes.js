const express = require('express')
const router = express.Router()
const {checkID, checkBody, getAllTours, createTour, getTour, updateTour, deleteTour} = require('../controllers/tourController')


router
	.param('id', checkID) // Param middleware function

router
	.route('/')
	.get(getAllTours)
	.post(createTour)

router
	.route('/:id')
	.get(getTour)
	.patch(checkBody, updateTour)
	.delete(deleteTour)

module.exports = router