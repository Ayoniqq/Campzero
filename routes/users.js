const express = require('express');
const router = express.Router();
const passport = require('passport');
const { nextTick } = require('process');
const User = require('../models/user');
const userController = require('../controllers/users');

router.get('/register', userController.newUserForm);

router.post('/register', userController.registerUser);


//LOGIN
router.get('/login', userController.userLoginForm)
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.userLogin)

//LOGOUT
router.get('/logout', userController.userLogout);

module.exports = router;




//iphone 2 pswd: trbd6f89648y8