const express = require('express')
const {aliasTopTours, getTourStats, getMonthlyPlan, getAllTours, createTour, getTour, updateTour, deleteTour, getToursWithin} = require('../controllers/tourController')
const reviewRouter = require('../routes/reviewRoutes')
const {protect, restrictTo} = require('../controllers/authController')
const router = express.Router()

router
	.use('/:tourId/reviews', reviewRouter)

router
	.route('/top-5-cheap')
	.get(aliasTopTours, getAllTours)

router
	.route('/tours-within/:distance/center/:latlng/unit/:unit')
	.get(getToursWithin)

router
	.route('/stats' )
	.get(getTourStats)

router
	.route('/monthly-plan/:year')
	.get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan)
	
router
	.route('/')
	.get(getAllTours)
	.post(protect, restrictTo('admin', 'lead-guide'), createTour)

router
	.route('/:id')
	.get(getTour)
	.patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
	.delete(protect, restrictTo('admin'), deleteTour)

module.exports = router