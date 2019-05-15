//Checks if user is logged in before going to
//account page, otherwise redirects to log in page
exports.checkAccount = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

//Checks if user is logged in, redirects to message page if not
exports.checkAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/message');
}

//Goes to account page if authenticated
exports.forwardAuthenticated = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/account');
}