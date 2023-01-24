const Campground = require('../models/campground'); //Model
const Review = require('../models/review'); //Model

module.exports.addReview = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body);
    review.author = req.user._id;
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash('success', 'You have successfully created a review');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewsId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewsId } })
    const review = await Review.findByIdAndDelete(reviewsId);
    await campground.save();
    //await review.save();
    res.redirect(`/campgrounds/${id}`);
}