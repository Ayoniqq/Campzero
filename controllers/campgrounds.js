const expressError = require('../utils/expressError');
const Campground = require('../models/campground'); //Model
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken, includeGeometry: true });


module.exports.index = async (req, res, next) => {
    try {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds })
    }
    catch (e) {
        next(new expressError('CAMPGROUNDS NOT FOUND', 404));
    }
};

module.exports.newCampgroundForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {


    try {
        const campground = new Campground(req.body);

        const geoData = await geocoder.forwardGeocode({
            query: campground.location,
            limit: 1
        }).send();
        //res.send(geoData.body.features[0].geometry.coordinates); //MAPBOX GEOCODING
        campground.geometry = geoData.body.features[0].geometry;
        campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))  //IMAGEPATH AND FILENAME FROM CLOUDINARY
        campground.author = req.user._id; //associate each created post to the user currently logged in
        await campground.save();
        //console.log(campground);
        req.flash('success', 'You successfully created a Campground');
        res.redirect(`/campgrounds/${campground._id}`);
    }
    catch (e) {
        next(e);
    }

};

module.exports.showCampgrounds = async (req, res, next) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
        //console.log(campground);
        if (!campground) {
            req.flash('error', 'Could not find that Campground');
            return res.redirect('/campgrounds')
        }
        res.render('campgrounds/show', { campground });
    }
    catch (e) {
        next(new expressError('ERROR IN FINDING THIS CAMPGROUND', 404));
    }
}

module.exports.renderEditForm = async (req, res, next) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        res.render(`campgrounds/edit`, { campground });
    }
    catch (e) {
        next(new expressError('ERROR IN FINDING THIS CAMPGROUND', 404));
    }
};

module.exports.updateCampground = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(id, req.body);
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body }); //LINE 72 & 73 is what is giving me eror in my edit code
        //const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        //campground.images.push(...imgs);
        await campground.save();
        // if (req.body.deleteImages) {
        //     for (let filename of req.body.deleteImages) {
        //         await cloudinary.uploader.destroy(filename);
        //     }
        //     await campground.update({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        //     console.log(campground);
        // }
        req.flash('success', 'You have successfully Updated the Campground');
        res.redirect(`/campgrounds/${campground._id}`)
    }
    catch (e) {
        next(new expressError('ERROR IN FINDING THIS CAMPGROUND', 404));
    }
}

module.exports.deleteCampground = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id)
        req.flash('success', 'You have successfully deleted Campground')
        res.redirect('/campgrounds');
    }
    catch (e) {
        next(new expressError('ERROR IN FINDING THIS CAMPGROUND', 404));
    }
}
