var express = require('express');
var router = express.Router();
//var localStorage = require('localStorage');
//var cookieParser = require('cookie-parser');
//app.use(cookieParser());

router.get('/', function(req, res, next) {
    //var log = req.cookies['loggedIn'];
    //if (log) {
        res.render('account', {title: 'photofest'});
    //}
    //else {
    //    res.render('login', {title: 'photofest'});
    //}

});

module.exports = router;