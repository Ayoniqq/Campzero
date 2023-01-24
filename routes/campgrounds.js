const express = require('express');
const router = express.Router();
const expressError = require('../utils/expressError');
const Campground = require('../models/campground'); //Model
const { campgroundJoiSchema, reviewJoiSchema } = require('../joiSchema');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

const campgroundsController = require('../controllers/campgrounds');

const multer = require('multer');
const { storage } = require('../cloudinary'); //NODE ALWAYS AUTOMATICALLY LOOKS FOR INDEX.JS SO NO NEED TO WRITE IT
const upload = multer({ storage }); //DESTINATION IS NOW TO CLOUDINARY MULTER STORAGE
//const upload = multer({ dest: 'uploads/' });

//Find ALL and Show
router.get('/', campgroundsController.index);

//CREATE NEW
router.get('/new', isLoggedIn, campgroundsController.newCampgroundForm);

router.post('/', isLoggedIn, upload.array('image'), validateCampground, campgroundsController.createCampground)
//router.post('/', upload.array('image'))
// , (req, res) => {
//     console.log(req.body, req.file);
//     res.send("IMAGE UPLOADED SUCCESSFULLY");
// }) //THIS IS FOR SINGLE FILE(IMAGE) UPLOAD

// router.post('/', upload.array('image'), (req, res) => {
//     res.send(req.body, req.files);
// }) //THIS IS FOR MULIPLE FILE(IMAGE) UPLOAD

//Find ONE and show
router.get('/:id', campgroundsController.showCampgrounds)

//Edit One and Update
router.get('/:id/edit', isLoggedIn, isAuthor, upload.array('image'), campgroundsController.renderEditForm);


router.put('/:id', isLoggedIn, isAuthor, campgroundsController.updateCampground)

//Delete
router.delete('/:id', isLoggedIn, isAuthor, campgroundsController.deleteCampground)

module.exports = router;