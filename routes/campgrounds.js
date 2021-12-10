const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync'); //Error handling
const ExpressError = require('../utils/ExpressError'); //Error handling
const Campground = require('../models/campground');
const { isLoggedIn, validateCampground, isAuthor, multerMiddleware, imageNumChecker, multerUpdate } = require('../middleware');
/* const multer = require('multer');
const { storage } = require('../cloudinary'); //node automatically looks for an index.js file when you require a folder without specifying further
const upload = multer({ storage, limits:  {files: 4, fileSize: 3000000} }); */

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, multerMiddleware, validateCampground, catchAsync(campgrounds.createCampground))
    

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, multerUpdate, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;
