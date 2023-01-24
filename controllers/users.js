const User = require('../models/user');

module.exports.newUserForm = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const regUser = await User.register(user, password);
        req.login(regUser, err => {
            if (err) {
                next(err);
            }
            //console.log(regUser);
            req.flash('success', 'Welcome to YelpCamp');
            res.redirect('/campgrounds');
        })

    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');

    }
}

module.exports.userLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.userLogin = (req, res) => {
    req.flash('success', 'Welcome Back!');
    //console.log(req.path, req.originalUrl);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
    //res.redirect('/campgrounds');
}

module.exports.userLogout = (req, res, next) => {
    req.logout(err => {
        if (err) {
            return next(err)
        }
    });
    req.flash('success', 'Goodbye, hope to see you soon!');
    res.redirect('/campgrounds');
}