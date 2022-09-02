const express = require('express')
const router = express.Router()
const {aliasTopTours, getTourStats, getMonthlyPlan, getAllTours, createTour, getTour, updateTour, deleteTour} = require('../controllers/tourController')
const {protect} = require('../controllers/authController')

router
	.route('/top-5-cheap')
	.get(aliasTopTours, getAllTours)

router
	.route('/stats' )
	.get(getTourStats)

router
	.route('/monthly-plan/:year')
	.get(getMonthlyPlan)
	
router
	.route('/')
	.get(protect, getAllTours)
	.post(createTour)

router
	.route('/:id')
	.get(getTour)
	.patch(updateTour)
	.delete(deleteTour)

module.exports = router