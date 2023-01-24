const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const imageSchema = new Schema({
    url: String,
    filename: String
})

//DISPLAY THUMBNAIL
imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('upload', 'upload/w_200')
})

const opts = { toJSON: { virtuals: true } } //HElps us parse our virtuals created to be viewable on JSON

const campgroundSchema = new Schema({

    title: String,
    price: Number,
    // image: String,
    images: [imageSchema],
    description: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, opts)

//const google = "google.com";

campgroundSchema.virtual('properties.popupMarkup').get(function () {
    return `<strong><a href=${'campgrounds/' + this._id}>${this.title}</a></strong><p>${this.description.substring(0, 20)}...</p > `;
});

//If a campground is deleted, it deletes all associated reviews as well
campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;