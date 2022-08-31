const express = require('express')
const router = express.Router()
const {aliasTopTours, getAllTours, createTour, getTour, updateTour, deleteTour} = require('../controllers/tourController')

router
	.route('/top-5-cheap')
	.get(aliasTopTours, getAllTours)
	
router
	.route('/')
	.get(getAllTours)
	.post(createTour)

router
	.route('/:id')
	.get(getTour)
	.patch(updateTour)
	.delete(deleteTour)

module.exports = router