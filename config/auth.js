//Authentication functions

/*
 * Checks if user is logged in before going to
 * account page, otherwise redirects to log in page
 * @param req
 * @param res
 * @param next
 * @return next
 */
exports.checkAccount = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please log in. If you do not have an account, please sign up!');
    res.redirect('/login');
}


/*
 * Checks if user is logged in, redirects to message page if not
 * @param req
 * @param res
 * @param next
 * @return next
 */
exports.checkAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/message');
}

/*
 * Goes to account page if authenticated
 * @param req
 * @param res
 * @param next
 * @return next
 */
exports.forwardAuthenticated = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/account');
}