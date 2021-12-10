const { campgroundSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const { reviewSchema } = require('./schemas.js');
const Review = require('./models/review');
const multer = require('multer');
const { storage } = require('./cloudinary'); //node automatically looks for an index.js file when you require a folder without specifying further
const upload = multer({ storage, limits:  {files: 4, fileSize: 5000000} }).array('image');


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.multerMiddleware = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            req.flash('error', 'You can only upload a maximum of 4 pictures, size limit for each: 5MB');
            return res.redirect('/campgrounds/new');
        } else if (err) {
            req.flash('error', 'Unknown error. Please try again!');
            return res.redirect('/campgrounds/new');
        }
    
        next();
      })
    }


module.exports.multerUpdate = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const picNum = campground.images.length;
    const update = multer({ storage, limits:  {files: 4 - picNum, fileSize: 5000000} }).array('image');
    update(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            req.flash('error', 'You can only have a maximum of 4 pictures, size limit for each: 5MB');
            return res.redirect(`/campgrounds/${id}/edit`);
        } else if (err) {
            req.flash('error', 'Unknown error. Please try again!');
            return res.redirect(`/campgrounds/${id}/edit`);
        }
    
        next();
      })
    }

module.exports.validateCampground = (req, res, next) => { //middleware
    const { error } = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
     }
     next();
}

module.exports.authorReviewDenial = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
     }
     next();
}

module.exports.multipleReviewDenial = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
       }).populate('author');
     for(let review of campground.reviews) {
         if(review.author._id.equals(req.user._id)) {
            req.flash('error', 'You can only review once!');
            return res.redirect(`/campgrounds/${id}`)
         }
     } 
     next();
     
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
     }
     next();
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
        if(error){
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg, 400)
        } else {
            next();
        }
}
