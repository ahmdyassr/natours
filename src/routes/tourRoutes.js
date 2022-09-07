const express = require('express')
const {aliasTopTours, getTourStats, getMonthlyPlan, getAllTours, createTour, getTour, updateTour, deleteTour} = require('../controllers/tourController')
const reviewRouter = require('../routes/reviewRoutes')
const {protect, restrictTo} = require('../controllers/authController')
const router = express.Router()

router
	.use('/:tourId/reviews', reviewRouter)

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
	.delete(protect, restrictTo('admin'), deleteTour)

module.exports = router