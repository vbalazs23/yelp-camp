const express = require('express');
const router = express.Router({ mergeParams: true });
const { isReviewAuthor, validateReview, isLoggedIn, authorReviewDenial, multipleReviewDenial } = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const ExpressError = require('../utils/ExpressError'); //Error handling
const catchAsync = require('../utils/catchAsync'); //Error handling

router.post('/', isLoggedIn, authorReviewDenial, multipleReviewDenial, validateReview, catchAsync(reviews.createReview)); 

router.delete('/:reviewId', isReviewAuthor, isLoggedIn, catchAsync(reviews.deleteReview));

module.exports = router;

