const expressError = require('./utils/expressError');
const Campground = require('./models/campground'); //Model
const { campgroundJoiSchema, reviewJoiSchema } = require('./joiSchema');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    console.log('REQ USER: ', req.user)
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

//VALIDATE MIDDLEWARE JOI SCHEMA FOR DB
module.exports.validateCampground = (req, res, next) => {


    const { error } = campgroundJoiSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        next(new expressError(msg, 400));
    }
    else {
        next();
    }
    console.log(error);
}

//MIDDLEWARE FOR CAMPGROUND AUTHORIZATION
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//MIDDLEWARE FOR REVIEW AUTHORIZATION
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewsId } = req.params;
    const review = await Review.findById(reviewsId);
    if (!review.author.equals(req.user.id)) {
        req.flash('error', 'You do not have the permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//VALIDATE JOI SCHEMA FOR DB
module.exports.validateReview = (req, res, next) => {


    const { error } = reviewJoiSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        next(new expressError(msg, 400));
    }
    else {
        next();
    }
    console.log(error);
}


//module.exports = isLoggedIn;

