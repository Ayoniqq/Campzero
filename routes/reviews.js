const express = require('express');
const router = express.Router({ mergeParams: true }); //Merge Params helps to ensure tha params set are not different from that of the router(which has its own default params)
const expressError = require('../utils/expressError');
const Campground = require('../models/campground'); //Model
const Review = require('../models/review'); //Model
const { campgroundJoiSchema, reviewJoiSchema } = require('../joiSchema');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviewsController = require('../controllers/reviews');

//REVIEWS
router.post('/', validateReview, isLoggedIn, reviewsController.addReview);

router.delete('/:reviewsId', isLoggedIn, isReviewAuthor, reviewsController.deleteReview);

module.exports = router;